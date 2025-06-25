
-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profile verification" ON public.profiles;

-- Create a security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Create non-recursive policies using the security definer function
CREATE POLICY "Users can view own profile and admins can view all" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    id = auth.uid() OR public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update own profile and admins can update verification" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (
    id = auth.uid() OR public.is_admin(auth.uid())
  );
