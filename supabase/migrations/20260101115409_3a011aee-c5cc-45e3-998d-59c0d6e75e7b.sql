-- Drop the overly permissive "Read all profiles" policy
DROP POLICY IF EXISTS "Read all profiles" ON public.profiles;

-- Create new policy that only allows authenticated users to read profiles
CREATE POLICY "Authenticated users can read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);