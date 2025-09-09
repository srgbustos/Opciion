-- Fix security warning: Set proper search_path for all functions

-- Update the existing update_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update the prevent_role_updates function with proper search_path
CREATE OR REPLACE FUNCTION public.prevent_role_updates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  -- Allow role updates only if they're the same (no change) or if called by the security definer function
  IF OLD.role != NEW.role AND current_setting('role', true) != 'supabase_admin' THEN
    RAISE EXCEPTION 'Direct role updates are not allowed. Use update_user_role function instead.';
  END IF;
  
  RETURN NEW;
END;
$$;