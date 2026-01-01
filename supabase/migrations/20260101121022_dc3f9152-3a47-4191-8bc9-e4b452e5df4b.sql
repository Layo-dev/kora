-- Drop existing policy and recreate with sender validation
DROP POLICY IF EXISTS "participants can send messages" ON public.messages;

CREATE POLICY "participants can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1 = auth.uid() OR matches.user2 = auth.uid())
  )
);