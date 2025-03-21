-- ENUM TYPES
CREATE TYPE ticket_status_enum AS ENUM (
    'FOR CANVASS', 'WORK IN PROGRESS', 
    'IN REVIEW', 'FOR APPROVAL', 'DONE', 'CANCELED', 'FOR REVIEW OF SUBMISSIONS'
);

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

CREATE TYPE approval_status_enum AS ENUM ('APPROVED', 'REJECTED', 'PENDING');
CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'PURCHASER', 'REVIEWER');

-- USER TABLE (Manages User Roles)
DROP TABLE IF EXISTS user_table CASCADE;
CREATE TABLE user_table (
    user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    user_role user_role_enum DEFAULT 'PURCHASER' NOT NULL,
    user_avatar TEXT,
    user_full_name TEXT,
    user_email TEXT
);

-- create comment_table and comment_reply_table
DROP TABLE IF EXISTS comment_reply_table CASCADE;
DROP TABLE IF EXISTS comment_table CASCADE;

CREATE TABLE comment_table (
  comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_ticket_id UUID NOT NULL,
  comment_content TEXT NOT NULL,
  comment_date_created TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL,
  comment_is_edited BOOLEAN DEFAULT FALSE,
  comment_is_disabled BOOLEAN DEFAULT FALSE,
  comment_type TEXT NOT NULL,
  comment_last_updated TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL,
  comment_user_id UUID NOT NULL,  -- Add the user_id to track the user who posted the comment
  FOREIGN KEY (comment_user_id) REFERENCES user_table(user_id)  -- Assuming you have a user_table
);

-- Enable Supabase Realtime on this table
ALTER PUBLICATION supabase_realtime ADD TABLE comment_table;
ALTER TABLE comment_table REPLICA IDENTITY FULL;

CREATE TABLE comment_reply_table (
  reply_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_parent_comment_id UUID NOT NULL,
  reply_child_comment_id UUID NOT NULL,
  FOREIGN KEY (reply_parent_comment_id) REFERENCES comment_table(comment_id),
  FOREIGN KEY (reply_child_comment_id) REFERENCES comment_table(comment_id)
);

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
  ticket_rf_date_received TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL,
  ticket_date_created TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()),
  ticket_last_updated TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) 
);

-- DROP TABLE IF EXISTS
DROP TABLE IF EXISTS ticket_shared_with_table cascade;

-- CREATE SHARED TICKET TABLE
CREATE TABLE public.ticket_shared_with_table (
    ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    shared_user_id UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()), 
    assigned_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, shared_user_id)
);

-- CANVASS FORM TABLE (Stores Supplier Quotes & Submissions)
DROP TABLE IF EXISTS canvass_form_table CASCADE;
CREATE TABLE public.canvass_form_table (
    canvass_form_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canvass_form_ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    canvass_form_rf_date_received TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL,
    canvass_form_recommended_supplier TEXT NOT NULL,
    canvass_form_lead_time_day INT NOT NULL CHECK (canvass_form_lead_time_day > 0),
    canvass_form_total_amount DECIMAL(10,2) NOT NULL CHECK (canvass_form_total_amount > 0), 
    canvass_form_payment_terms TEXT,
    canvass_form_submitted_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE SET NULL,
    canvass_form_date_submitted TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL
);

-- CANVASS ATTACHMENT TABLE (Stores Canvass Attachments)
DROP TABLE IF EXISTS canvass_attachment_table CASCADE;
CREATE TABLE public.canvass_attachment_table (
    canvass_attachment_id UUID NOT NULL DEFAULT gen_random_uuid(),
    canvass_attachment_canvass_form_id UUID NULL DEFAULT gen_random_uuid(),
    canvass_attachment_type TEXT NULL,
    canvass_attachment_url TEXT NULL,
    canvass_attachment_created_at TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL,
    CONSTRAINT canvass_attachment_table_pkey PRIMARY KEY (canvass_attachment_id),
    CONSTRAINT canvass_attachment_table_canvass_attachment_canvass_form_id_fkey
        FOREIGN KEY (canvass_attachment_canvass_form_id)
        REFERENCES canvass_form_table (canvass_form_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) TABLESPACE pg_default;

-- APPROVAL TABLE (Tracks Review & Approvals)
DROP TABLE IF EXISTS approval_table CASCADE;
CREATE TABLE public.approval_table (
    approval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    approval_reviewed_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    approval_review_status approval_status_enum NOT NULL, 
    approval_review_date TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL
);

-- TICKET STATUS HISTORY TABLE (Tracks Status Changes for Workflow)
DROP TABLE IF EXISTS ticket_status_history_table CASCADE;
CREATE TABLE public.ticket_status_history_table (
    ticket_status_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_status_history_ticket_id UUID NOT NULL REFERENCES public.ticket_table(ticket_id) ON DELETE CASCADE,
    ticket_status_history_previous_status ticket_status_enum NOT NULL, 
    ticket_status_history_new_status ticket_status_enum NOT NULL, 
    ticket_status_history_changed_by UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
    ticket_status_history_change_date TIMESTAMPTZ DEFAULT timezone('Asia/Manila', now()) NOT NULL
);

DROP TABLE IF EXISTS notification_table CASCADE;
CREATE TABLE notification_table (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_user_id UUID NOT NULL REFERENCES public.user_table(user_id) ON DELETE CASCADE,
  notification_message TEXT NOT NULL,
  notification_read BOOLEAN DEFAULT FALSE,
  notification_url TEXT NULL,
  notification_created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Supabase Realtime on this table
ALTER PUBLICATION supabase_realtime ADD TABLE notification_table;

-- GRANT Permissions (Ensure Permissions Are Set)
GRANT SELECT, INSERT, UPDATE, DELETE ON user_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON canvass_form_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON approval_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_status_history_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON notification_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_shared_with_table TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON canvass_attachment_table TO authenticated;

CREATE OR REPLACE FUNCTION public.create_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_table (
    user_id, 
    user_full_name, 
    user_email,
    user_avatar
  )
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      NEW.raw_user_meta_data->>'full_name', 
      'Unnamed User'
    ), 
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url', 
      ''
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
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
  ticket_date_created TIMESTAMP, -- Added this field
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
    t.ticket_date_created, -- Added this field

    -- Combine all shared users into an array
    COALESCE(
      JSON_AGG(DISTINCT ts.shared_user_id) FILTER (WHERE ts.shared_user_id IS NOT NULL),
      '[]'::JSON
    ) AS shared_users,

    -- Get all reviewers
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
    (SELECT * FROM ticket_table ORDER BY ticket_date_created DESC) t -- Sorting before aggregation

  LEFT JOIN
    ticket_shared_with_table ts ON ts.ticket_id = t.ticket_id

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
    t.ticket_created_by,
    t.ticket_date_created -- Ensuring this is grouped properly
  ORDER BY
    t.ticket_date_created DESC -- Ensuring the final output is sorted
$$;

--view for realtime comment
CREATE VIEW comment_with_avatar_view AS
SELECT 
    c.comment_id,
    c.comment_ticket_id,
    c.comment_content,
    c.comment_date_created,
    c.comment_is_edited,
    c.comment_is_disabled,
    c.comment_type,
    c.comment_last_updated,
    c.comment_user_id,
    u.user_full_name AS comment_user_full_name,
    u.user_avatar AS comment_user_avatar
FROM comment_table c
LEFT JOIN user_table u ON c.comment_user_id = u.user_id;


--function for comment
create or replace function get_comments_with_avatars(ticket_id uuid)
returns table(
  comment_id uuid,
  comment_ticket_id uuid,
  comment_content text,
  comment_date_created timestamp,
  comment_is_edited boolean,
  comment_is_disabled boolean,
  comment_type text,
  comment_last_updated timestamp,
  comment_user_id uuid,
  comment_user_avatar text,
  comment_user_full_name text -- Add full name column
) language sql
as $$

  select
    c.comment_id,
    c.comment_ticket_id,
    c.comment_content,
    c.comment_date_created,
    c.comment_is_edited,
    c.comment_is_disabled,
    c.comment_type,
    c.comment_last_updated,
    c.comment_user_id,
    u.user_avatar as comment_user_avatar,
    u.user_full_name as comment_user_full_name
  from
    comment_table c
  left join
    user_table u on c.comment_user_id = u.user_id
  where
    c.comment_ticket_id = ticket_id
    and c.comment_type = 'COMMENT'
  order by c.comment_date_created asc;
$$;

--function for getting specific ticket
drop function if exists get_ticket_details(uuid);
create or replace function get_ticket_details(ticket_uuid uuid)
returns table (
  ticket_id uuid,
  ticket_item_name text, 
  ticket_item_description text,
  ticket_status text,
  ticket_created_by uuid,
  ticket_created_by_name text, 
  ticket_created_by_avatar text, 
  ticket_quantity integer,
  ticket_specifications text,
  approval_status text,
  ticket_date_created timestamp,
  ticket_last_updated timestamp,
  ticket_notes text,
  ticket_rf_date_received timestamp, 
  shared_users json,
  reviewers json
)
language sql
as $$

  select 
    t.ticket_id,
    t.ticket_item_name, 
    t.ticket_item_description,
    t.ticket_status,
    t.ticket_created_by,

    u.user_full_name as ticket_created_by_name,
    u.user_avatar as ticket_created_by_avatar,  

    t.ticket_quantity,
    t.ticket_specifications,

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
    t.ticket_notes,
    t.ticket_rf_date_received,

    (
      select coalesce(
        json_agg(
          json_build_object(
            'user_id', u2.user_id,
            'user_full_name', u2.user_full_name,
            'user_email', u2.user_email,
            'user_avatar', u2.user_avatar 
          )
        ), '[]'
      )
      from ticket_shared_with_table ts
      left join user_table u2 on u2.user_id = ts.shared_user_id
      where ts.ticket_id = t.ticket_id
    )::json as shared_users,

    (
      select coalesce(
        json_agg(
          json_build_object(
            'reviewer_id', a.approval_reviewed_by,
            'reviewer_name', u3.user_full_name,
            'reviewer_avatar', u3.user_avatar, 
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

CREATE OR REPLACE FUNCTION public.add_comment_with_notification(
  p_ticket_id UUID,
  p_content TEXT,
  p_user_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_comment_id UUID;
  v_commenter_role user_role_enum;
  v_target_user_id UUID;
  v_commenter_name TEXT;
  v_ticket_creator_id UUID;
BEGIN
  -- Get the role and name of the user who is commenting
  SELECT user_role, user_full_name
  INTO v_commenter_role, v_commenter_name
  FROM public.user_table
  WHERE user_id = p_user_id;

  -- Get the ticket creator's ID
  SELECT ticket_created_by
  INTO v_ticket_creator_id
  FROM public.ticket_table
  WHERE ticket_id = p_ticket_id;

  -- Insert the comment
  INSERT INTO public.comment_table (
    comment_ticket_id,
    comment_content,
    comment_type,
    comment_date_created,
    comment_is_edited,
    comment_user_id
  ) VALUES (
    p_ticket_id,
    p_content,
    'COMMENT',
    timezone('Asia/Manila', now()),
    false,
    p_user_id
  ) RETURNING comment_id INTO v_comment_id;

  -- Determine the target user for notification based on commenter's role
  IF v_commenter_role = 'REVIEWER' THEN
    -- If commenter is REVIEWER, notify the ticket creator (PURCHASER)
    v_target_user_id := v_ticket_creator_id;
  ELSE
    -- If commenter is PURCHASER, notify a REVIEWER
    SELECT user_id INTO v_target_user_id
    FROM public.user_table
    WHERE user_role = 'REVIEWER'
    LIMIT 1;
  END IF;

  -- Insert the notification
  INSERT INTO public.notification_table (
    notification_user_id,
    notification_message,
    notification_url,
    notification_read
  ) VALUES (
    v_target_user_id,
    v_commenter_name || ' has added a new comment on ticket ' || p_ticket_id,
    '/tickets/' || p_ticket_id,
    false
  );

  RETURN v_comment_id;
END;
$$;
