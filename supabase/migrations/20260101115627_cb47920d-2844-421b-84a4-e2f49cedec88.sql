-- Add UPDATE policy for matches table
-- Users can only update their own last_read_at timestamp
CREATE POLICY "Users can update own read timestamp"
ON public.matches
FOR UPDATE
TO authenticated
USING (auth.uid() = user1 OR auth.uid() = user2)
WITH CHECK (auth.uid() = user1 OR auth.uid() = user2);