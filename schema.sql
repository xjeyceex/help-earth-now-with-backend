DROP TABLE IF EXISTS user_table CASCADE;
CREATE TABLE user_table (
    user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    user_avatar TEXT,
    user_full_name TEXT,
    user_email TEXT
);

-- Enable Row-Level Security
ALTER TABLE public.user_table ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to SELECT
DROP POLICY IF EXISTS select_users ON public.user_table;
CREATE POLICY select_users 
ON public.user_table 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow all authenticated users to INSERT
DROP POLICY IF EXISTS insert_users ON public.user_table;
CREATE POLICY insert_users 
ON public.user_table 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to UPDATE
DROP POLICY IF EXISTS update_users ON public.user_table;
CREATE POLICY update_users 
ON public.user_table 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow all authenticated users to DELETE
DROP POLICY IF EXISTS delete_users ON public.user_table;
CREATE POLICY delete_users 
ON public.user_table 
FOR DELETE 
USING (auth.role() = 'authenticated');

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
    COALESCE(NEW.email, ''), -- Prevent NULL email issues
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (user_id) DO NOTHING; -- Avoid duplicate inserts

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Recreate the trigger
DROP TRIGGER IF EXISTS after_user_signup ON auth.users;
CREATE TRIGGER after_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user();