-- Add new columns to profiles table for expanded profile attributes
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS relationship_status text,
ADD COLUMN IF NOT EXISTS sexuality text,
ADD COLUMN IF NOT EXISTS children text,
ADD COLUMN IF NOT EXISTS smoking text,
ADD COLUMN IF NOT EXISTS drinking text,
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS height integer,
ADD COLUMN IF NOT EXISTS star_sign text,
ADD COLUMN IF NOT EXISTS pets text,
ADD COLUMN IF NOT EXISTS religion text,
ADD COLUMN IF NOT EXISTS personality text,
ADD COLUMN IF NOT EXISTS education_level text,
ADD COLUMN IF NOT EXISTS work text,
ADD COLUMN IF NOT EXISTS education text;