-- Security fixes: Restrict profile access and prevent role escalation

-- Drop the overly permissive profile viewing policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create more restrictive profile viewing policy (authenticated users only)
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Drop the current update policy that allows role changes
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new update policy that excludes role changes
CREATE POLICY "Users can update their own profile (except role)" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent role changes by ensuring the role stays the same
  role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Create a security definer function for admin role management
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role text;
BEGIN
  -- Get the current user's role
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  -- Only allow admins to change roles
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can update user roles';
  END IF;
  
  -- Update the target user's role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Add a trigger to prevent direct role updates
CREATE OR REPLACE FUNCTION public.prevent_role_updates()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow role updates only if they're the same (no change) or if called by the security definer function
  IF OLD.role != NEW.role AND current_setting('role', true) != 'supabase_admin' THEN
    RAISE EXCEPTION 'Direct role updates are not allowed. Use update_user_role function instead.';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_direct_role_updates
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_updates();