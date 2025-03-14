-- Enable RLS on all tables
ALTER TABLE IF EXISTS user_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS canvass_form_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS approval_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_status_history_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ticket_shared_with_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.canvass_attachment_table ENABLE ROW LEVEL SECURITY;

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
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own avatar" ON user_table;
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

-- ✅ DROP TABLE IF EXISTS
DROP TABLE IF EXISTS ticket_shared_with_table cascade;

-- ✅ CREATE SHARED TICKET TABLE
CREATE TABLE public.ticket_shared_with_table (
    ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    shared_user_id UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),  -- Tracks assignment time
    assigned_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, shared_user_id) -- Ensures a user is not added twice for the same ticket
);

-- ✅ POLICY: Users can view tickets they created or are shared with
DROP POLICY IF EXISTS "Users can view their own and shared tickets" ON ticket_table;

CREATE POLICY "Users can view their own and shared tickets" ON ticket_table
FOR SELECT USING (
  auth.uid() = ticket_created_by 
  OR auth.uid() IN (
    SELECT shared_user_id FROM ticket_shared_with_table 
    WHERE ticket_id = ticket_table.ticket_id
  )
);

-- ✅ POLICY: Canvassers can create tickets
DROP POLICY IF EXISTS "Canvassers can create tickets" ON ticket_table;

CREATE POLICY "Canvassers can create tickets" ON ticket_table
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM user_table 
    WHERE user_role = 'CANVASSER'
  )
);

-- ✅ POLICY: Users can update tickets if they are the creator or shared
DROP POLICY IF EXISTS "Users can update tickets if shared" ON ticket_table;

CREATE POLICY "Users can update tickets if shared" ON ticket_table
FOR UPDATE USING (
  auth.uid() = ticket_created_by 
  OR auth.uid() IN (
    SELECT shared_user_id FROM ticket_shared_with_table 
    WHERE ticket_id = ticket_table.ticket_id
  )
);


-- ✅ POLICY: Only the ticket creator can delete a ticket
DROP POLICY IF EXISTS "Only ticket creator can delete" ON ticket_table;

CREATE POLICY "Only ticket creator can delete" ON ticket_table
FOR DELETE USING (
  auth.uid() = ticket_created_by
);

-- POLICY: Users can view tickets they are shared with
DROP POLICY IF EXISTS "Users can view shared tickets" ON ticket_shared_with_table;
CREATE POLICY "Users can view shared tickets" ON ticket_shared_with_table
    FOR SELECT USING (
        auth.uid() = shared_user_id 
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
            SELECT shared_user_id FROM ticket_shared_with_table 
            WHERE ticket_id = ticket_shared_with_table.ticket_id
        )
    );

-- POLICY: Only the ticket creator or the shared user can remove a shared user
DROP POLICY IF EXISTS "Users can remove shared users" ON ticket_shared_with_table;
CREATE POLICY "Users can remove shared users" ON ticket_shared_with_table
    FOR DELETE USING (
        auth.uid() = shared_user_id 
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

  
-- CANVASS ATTACHMENT TABLE (Stores Canvass Attachments)
DROP TABLE IF EXISTS canvass_attachment_table CASCADE;
CREATE TABLE public.canvass_attachment_table (
    canvass_attachment_id UUID NOT NULL DEFAULT gen_random_uuid(),
    canvass_attachment_canvass_form_id UUID NULL DEFAULT gen_random_uuid(),
    canvass_attachment_type TEXT NULL,
    canvass_attachment_url TEXT NULL,
    canvass_attachment_created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT canvass_attachment_table_pkey PRIMARY KEY (canvass_attachment_id),
    CONSTRAINT canvass_attachment_table_canvass_attachment_canvass_form_id_fkey
        FOREIGN KEY (canvass_attachment_canvass_form_id)
        REFERENCES canvass_form_table (canvass_form_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) TABLESPACE pg_default;

-- RLS for Canvass Attachment Table
CREATE POLICY "allow_authenticated_users_to_insert"
ON public.canvass_attachment_table
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allow_authenticated_users_to_delete"
ON public.canvass_attachment_table
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "allow_authenticated_users_to_update"
ON public.canvass_attachment_table
FOR UPDATE
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allow_authenticated_users_to_select"
ON public.canvass_attachment_table
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);


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
        SELECT shared_user_id 
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

-- Trigger the function every time a user is created
create or replace function get_dashboard_tickets(_user_id uuid)
returns table (
  ticket_id uuid,
  ticket_status text,
  ticket_item_description text
)
language sql
as $$
  select 
    t.ticket_id,
    t.ticket_status,
    t.ticket_item_description

  from 
    ticket_table t

  where _user_id is null 

  or t.ticket_created_by = _user_id
  or exists (
    select 1 from ticket_shared_with_table s
    where s.ticket_id = t.ticket_id and s.shared_user_id = _user_id
  )

  or exists (
    select 1 from approval_table a
    where a.approval_ticket_id = t.ticket_id 
    and a.approval_reviewed_by = _user_id
  )
$$;

--function for all user tickets
DROP FUNCTION IF EXISTS get_all_my_tickets(UUID, TEXT, UUID);
CREATE OR REPLACE FUNCTION get_all_my_tickets(
  user_id UUID, 
  ticket_status TEXT DEFAULT NULL, 
  ticket_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
  ticket_id UUID,
  ticket_status TEXT,
  ticket_item_description TEXT,
  ticket_created_by UUID,
  shared_users JSON,
  reviewers JSON
)
LANGUAGE sql
AS $$  
  SELECT
    t.ticket_id,
    t.ticket_status,
    t.ticket_item_description,
    t.ticket_created_by,

    -- ✅ Combine all shared users into an array
    COALESCE(
      JSON_AGG(DISTINCT ts.shared_user_id) FILTER (WHERE ts.shared_user_id IS NOT NULL),
      '[]'::JSON
    ) AS shared_users,

    -- ✅ Get all reviewers
    COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'reviewer_id', a.approval_reviewed_by,
          'reviewer_name', a.user_full_name,
          'approval_status', a.approval_review_status
        )
      ) FILTER (WHERE a.approval_reviewed_by IS NOT NULL), '[]'::JSON
    ) AS reviewers

  FROM
    ticket_table t

  -- ✅ Left join for shared users
  LEFT JOIN
    ticket_shared_with_table ts ON ts.ticket_id = t.ticket_id

  -- ✅ Left join for reviewers
  LEFT JOIN
    (
      SELECT DISTINCT ON (a.approval_reviewed_by, a.approval_ticket_id)
        a.approval_ticket_id,
        a.approval_review_status,
        a.approval_reviewed_by,
        u.user_full_name
      FROM 
        approval_table a
      LEFT JOIN 
        user_table u ON u.user_id = a.approval_reviewed_by
    ) a ON a.approval_ticket_id = t.ticket_id

  WHERE
    user_id = ANY(ARRAY[t.ticket_created_by, ts.shared_user_id, a.approval_reviewed_by])
    AND (ticket_status IS NULL OR t.ticket_status = ticket_status)
    AND (ticket_uuid IS NULL OR t.ticket_id = ticket_uuid)

  GROUP BY
    t.ticket_id,
    t.ticket_status,
    t.ticket_item_description,
    t.ticket_created_by
$$;

--function for getting specific ticket
drop function if exists get_ticket_details(uuid);
create or replace function get_ticket_details(ticket_uuid uuid)
returns table (
  ticket_id uuid,
  ticket_item_description text,
  ticket_status text,
  ticket_created_by uuid,
  ticket_created_by_name text, -- ✅ Added this
  ticket_quantity integer,
  ticket_specifications text,
  approval_status text,
  ticket_date_created timestamp,
  ticket_last_updated timestamp,
  shared_users json,
  reviewers json
)
language sql
as $$
  select 
    t.ticket_id,
    t.ticket_item_description,
    t.ticket_status,
    t.ticket_created_by,

    -- ✅ Get creator name
    u.user_full_name as ticket_created_by_name,

    t.ticket_quantity,
    t.ticket_specifications,

    -- ✅ Get the overall approval status
    coalesce(
      (
        select a.approval_review_status
        from approval_table a
        where a.approval_ticket_id = t.ticket_id
        limit 1
      ), 'PENDING'
    ) as approval_status,

    t.ticket_date_created,
    t.ticket_last_updated,

    -- ✅ Separate Subquery for shared_users
    (
      select coalesce(
        json_agg(
          json_build_object(
            'user_id', u2.user_id,
            'user_full_name', u2.user_full_name,
            'user_email', u2.user_email
          )
        ), '[]'
      )
      from ticket_shared_with_table ts
      left join user_table u2 on u2.user_id = ts.shared_user_id
      where ts.ticket_id = t.ticket_id
    )::json as shared_users,

    -- ✅ Separate Subquery for reviewers
    (
      select coalesce(
        json_agg(
          json_build_object(
            'reviewer_id', a.approval_reviewed_by,
            'reviewer_name', u3.user_full_name,
            'approval_status', a.approval_review_status
          )
        ), '[]'
      )
      from approval_table a
      left join user_table u3 on u3.user_id = a.approval_reviewed_by
      where a.approval_ticket_id = t.ticket_id
    )::json as reviewers

  from 
    ticket_table t

  -- ✅ Left Join to get the creator's name
  left join user_table u on u.user_id = t.ticket_created_by

  where t.ticket_id = ticket_uuid
$$;

-- share ticket function
drop function if exists share_ticket(uuid, uuid, uuid);
create or replace function share_ticket(
  _ticket_id uuid,
  _shared_user_id uuid,
  _assigned_by uuid
)
returns void
language sql
as $$
  insert into ticket_shared_with_table (
    ticket_id,
    shared_user_id,
    assigned_by
  )
  select 
    _ticket_id,
    _shared_user_id,
    _assigned_by
  from ticket_table
  where ticket_id = _ticket_id
  and ticket_created_by != _shared_user_id;
$$;

create policy "Allow authenticated users to insert" 
on storage.objects 
for insert 
to authenticated 
with check (auth.uid() is not null);

create policy "Allow authenticated users to delete" 
on storage.objects 
for delete 
to authenticated 
using (auth.uid() is not null);

create policy "Allow authenticated users to select" 
on storage.objects 
for select 
to authenticated 
using (auth.uid() is not null);
