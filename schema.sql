-- Enable RLS on all tables
ALTER TABLE IF EXISTS user_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS canvass_form_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS approval_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_status_history_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ticket_shared_with_table ENABLE ROW LEVEL SECURITY;

-- ENUM TYPES
CREATE TYPE ticket_status_enum AS ENUM (
    'FOR CANVASS', 'WORK IN PROGRESS', 'FOR REVIEW', 
    'IN REVIEW', 'FOR APPROVAL', 'DONE', 'CANCELED'
);

CREATE TYPE approval_status_enum AS ENUM ('APPROVED', 'REJECTED', 'PENDING');
CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'CANVASSER', 'REVIEWER');

-- USER TABLE (Manages User Roles)
DROP TABLE IF EXISTS user_table CASCADE;
CREATE TABLE user_table (
    user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    user_role user_role_enum DEFAULT 'CANVASSER' NOT NULL,
    user_avatar TEXT,
    user_full_name TEXT,
    user_email TEXT
);

-- RLS for User Table
DROP POLICY IF EXISTS "Users can view their own role data" ON user_table;
CREATE POLICY "Users can view their own role data" ON user_table
    FOR SELECT USING (auth.uid() = user_id);

--RLS for Avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (auth.uid() = owner);

CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
USING (TRUE);

CREATE POLICY "Allow users to update their own avatar"
ON user_table
FOR UPDATE
USING (auth.uid() = user_id);

-- TICKET TABLE (Tracks Canvassing Requests)
DROP TABLE IF EXISTS ticket_table CASCADE;
CREATE TABLE public.ticket_table (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_item_name TEXT NOT NULL,
    ticket_item_description TEXT NOT NULL,
    ticket_quantity INT NOT NULL CHECK (ticket_quantity > 0), 
    ticket_specifications TEXT,
    ticket_notes TEXT,
    ticket_status ticket_status_enum NOT NULL DEFAULT 'FOR CANVASS', 
    ticket_created_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    ticket_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ticket_last_updated TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- SHARED TICKET TABLE
DROP TABLE IF EXISTS ticket_shared_with_table;
CREATE TABLE public.ticket_shared_with_table (
    ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),  -- Tracks assignment time
    assigned_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE, -- Who assigned this user
    PRIMARY KEY (ticket_id, user_id) -- Ensures a user is not added twice for the same ticket
);

-- POLICY: Users can view tickets they created or are shared with
DROP POLICY IF EXISTS "Users can view their own and shared tickets" ON ticket_table;
CREATE POLICY "Users can view their own and shared tickets" ON ticket_table
    FOR SELECT USING (
        auth.uid() = ticket_created_by 
        OR auth.uid() IN (SELECT user_id FROM ticket_shared_with_table WHERE ticket_id = ticket_table.ticket_id)
    );

-- POLICY: Canvassers can create tickets
DROP POLICY IF EXISTS "Canvassers can create tickets" ON ticket_table;
CREATE POLICY "Canvassers can create tickets" ON ticket_table
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT user_id FROM user_table WHERE user_role = 'CANVASSER')
    );

-- POLICY: Users can update tickets if they are the creator or shared
DROP POLICY IF EXISTS "Users can update tickets if shared" ON ticket_table;
CREATE POLICY "Users can update tickets if shared" ON ticket_table
    FOR UPDATE USING (
        auth.uid() = ticket_created_by 
        OR auth.uid() IN (SELECT user_id FROM ticket_shared_with_table WHERE ticket_id = ticket_table.ticket_id)
    );

-- POLICY: Only the ticket creator can delete a ticket
DROP POLICY IF EXISTS "Only ticket creator can delete" ON ticket_table;
CREATE POLICY "Only ticket creator can delete" ON ticket_table
    FOR DELETE USING (
        auth.uid() = ticket_created_by
    );



-- POLICY: Users can view tickets they are shared with
DROP POLICY IF EXISTS "Users can view shared tickets" ON ticket_shared_with_table;
CREATE POLICY "Users can view shared tickets" ON ticket_shared_with_table
    FOR SELECT USING (
        auth.uid() = user_id 
        OR auth.uid() IN (SELECT ticket_created_by FROM ticket_table WHERE ticket_id = ticket_shared_with_table.ticket_id)
    );

-- POLICY: Users can add any user to a shared ticket if they are the ticket creator or already shared
DROP POLICY IF EXISTS "Users can share tickets with others" ON ticket_shared_with_table;
CREATE POLICY "Users can share tickets with others" ON ticket_shared_with_table
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT ticket_created_by FROM ticket_table 
            WHERE ticket_id = ticket_shared_with_table.ticket_id
        ) 
        OR auth.uid() IN (
            SELECT user_id FROM ticket_shared_with_table 
            WHERE ticket_id = ticket_shared_with_table.ticket_id
        )
    );

-- POLICY: Only the ticket creator or the shared user can remove a shared user
DROP POLICY IF EXISTS "Users can remove shared users" ON ticket_shared_with_table;
CREATE POLICY "Users can remove shared users" ON ticket_shared_with_table
    FOR DELETE USING (
        auth.uid() = user_id 
        OR auth.uid() IN (
            SELECT ticket_created_by FROM ticket_table 
            WHERE ticket_id = ticket_shared_with_table.ticket_id
        )
    );


-- CANVASS FORM TABLE (Stores Supplier Quotes & Submissions)
DROP TABLE IF EXISTS canvass_form_table CASCADE;
CREATE TABLE public.canvass_form_table (
    canvass_form_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canvass_form_ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    canvass_form_supplier_name TEXT NOT NULL,
    canvass_form_quotation_price DECIMAL(10,2) NOT NULL CHECK (canvass_form_quotation_price > 0), 
    canvass_form_quotation_terms TEXT,
    canvass_form_attachment_url TEXT, 
    canvass_form_submitted_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE SET NULL,
    canvass_form_date_submitted TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for Canvass Form Table
DROP POLICY IF EXISTS "Canvassers can submit canvass forms" ON canvass_form_table;
CREATE POLICY "Canvassers can submit canvass forms" ON canvass_form_table
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role = 'CANVASSER'));

DROP POLICY IF EXISTS "Reviewers can view canvass forms" ON canvass_form_table;
CREATE POLICY "Reviewers can view canvass forms" ON canvass_form_table
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role = 'REVIEWER'));

-- APPROVAL TABLE (Tracks Review & Approvals)
DROP TABLE IF EXISTS approval_table CASCADE;
CREATE TABLE public.approval_table (
    approval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    approval_reviewed_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    approval_review_status approval_status_enum NOT NULL, 
    approval_review_comments TEXT,
    approval_review_date TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for Approval Table
DROP POLICY IF EXISTS "Reviewers can review" ON approval_table;
CREATE POLICY "Reviewers can review" ON approval_table
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role = 'REVIEWER'));

-- TICKET STATUS HISTORY TABLE (Tracks Status Changes for Workflow)
DROP TABLE IF EXISTS ticket_status_history_table CASCADE;
CREATE TABLE public.ticket_status_history_table (
    ticket_status_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_status_history_ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    ticket_status_history_previous_status ticket_status_enum NOT NULL, 
    ticket_status_history_new_status ticket_status_enum NOT NULL, 
    ticket_status_history_changed_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    ticket_status_history_change_date TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for Ticket Status History Table
DROP POLICY IF EXISTS "Users can view ticket status history of their shared tickets" ON ticket_status_history_table;
CREATE POLICY "Users can view ticket status history of their shared tickets" 
ON ticket_status_history_table
FOR SELECT USING (
    auth.uid() IN (
        SELECT user_id 
        FROM ticket_shared_with_table 
        WHERE ticket_shared_with_table.ticket_id = ticket_status_history_table.ticket_status_history_ticket_id
    )
);

-- GRANT Permissions (Ensure Permissions Are Set)
GRANT SELECT, INSERT, UPDATE, DELETE ON user_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON canvass_form_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON approval_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_status_history_table TO authenticated;

-- Update the create_user function to rely on default values
CREATE OR REPLACE FUNCTION public.create_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_table (
    user_id, 
    user_full_name, 
    user_email
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'display_name', 
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS after_user_signup ON auth.users;
CREATE TRIGGER after_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user();