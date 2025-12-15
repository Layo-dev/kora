-- Add intent and onboarding_complete columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS intent text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- Update the INSERT policy to allow users to create their own profile during onboarding
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);