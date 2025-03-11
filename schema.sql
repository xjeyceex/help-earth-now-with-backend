-- Enable RLS on all tables
ALTER TABLE IF EXISTS user_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS canvass_form_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS approval_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_status_history_table ENABLE ROW LEVEL SECURITY;

CREATE TYPE ticket_status_enum AS ENUM ('FOR CANVASS', 'WORK IN PROGRESS', 'FOR REVIEW OF SUBMISSIONS',
                                        'IN REVIEW', 'WAITING FOR PURCHASER', 'FOR APPROVAL', 'DONE', 'DECLINED', 'CANCELED');
CREATE TYPE approval_status_enum AS ENUM ('APPROVED', 'REJECTED');
CREATE TYPE user_role_enum AS ENUM ('PURCHASER', 'SUPERVISOR', 'MANAGER');

-- USER TABLE (Manages User Roles)
DROP TABLE IF EXISTS user_table CASCADE;
CREATE TABLE user_table (
    user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    user_role user_role_enum DEFAULT 'ADMIN' NOT NULL ,
    user_avatar TEXT
);

-- Apply RLS for User Table
DROP POLICY IF EXISTS "Users can view their own role data" ON user_table;
CREATE POLICY "Users can view their own role data" ON user_table
    FOR SELECT USING (auth.uid() = user_id);

-- TICKET TABLE (Tracks Canvassing Requests)
DROP TABLE IF EXISTS ticket_table CASCADE;
CREATE TABLE public.ticket_table (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_item_description TEXT NOT NULL,
    ticket_quantity INT NOT NULL CHECK (ticket_quantity > 0), 
    ticket_specifications TEXT,
    ticket_status ticket_status_enum NOT NULL DEFAULT 'FOR CANVASS', 
    ticket_created_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    ticket_assigned_to UUID REFERENCES public.user_table(user_id) ON DELETE SET NULL, 
    ticket_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ticket_last_updated TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Apply RLS for Ticket Table
DROP POLICY IF EXISTS "Users can view their own tickets" ON ticket_table;
CREATE POLICY "Users can view their own tickets" ON ticket_table
    FOR SELECT USING (auth.uid() = ticket_created_by OR auth.uid() = ticket_assigned_to);

DROP POLICY IF EXISTS "Purchasers can create tickets" ON ticket_table;
CREATE POLICY "Purchasers can create tickets" ON ticket_table
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role = 'PURCHASER'));

DROP POLICY IF EXISTS "Assigned users can update tickets" ON ticket_table;
CREATE POLICY "Assigned users can update tickets" ON ticket_table
    FOR UPDATE USING (auth.uid() = ticket_assigned_to);

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

-- Apply RLS for Canvass Form Table
DROP POLICY IF EXISTS "Purchasers can submit canvass forms" ON canvass_form_table;
CREATE POLICY "Purchasers can submit canvass forms" ON canvass_form_table
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role = 'PURCHASER'));

DROP POLICY IF EXISTS "Supervisors & Managers can view canvass forms" ON canvass_form_table;
CREATE POLICY "Supervisors & Managers can view canvass forms" ON canvass_form_table
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role IN ('SUPERVISOR', 'MANAGER')));

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

-- Apply RLS for Approval Table
DROP POLICY IF EXISTS "Supervisors & Managers can review" ON approval_table;
CREATE POLICY "Supervisors & Managers can review" ON approval_table
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_table WHERE user_role IN ('SUPERVISOR', 'MANAGER')));

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

-- Apply RLS for Ticket Status History Table
DROP POLICY IF EXISTS "Users can view ticket status history of their assigned tickets" ON ticket_status_history_table;
CREATE POLICY "Users can view ticket status history of their assigned tickets" ON ticket_status_history_table
    FOR SELECT USING (auth.uid() IN (SELECT ticket_assigned_to FROM ticket_table WHERE ticket_table.ticket_id = ticket_status_history_table.ticket_status_history_ticket_id));

-- GRANT Permissions (Ensure Permissions Are Set)
GRANT SELECT, INSERT, UPDATE, DELETE ON user_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON canvass_form_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON approval_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_status_history_table TO authenticated;

CREATE OR REPLACE FUNCTION public.create_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_table (user_id, user_role, user_avatar)
  VALUES (
    new.id,
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS after_user_signup ON auth.users;
CREATE TRIGGER after_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user();

