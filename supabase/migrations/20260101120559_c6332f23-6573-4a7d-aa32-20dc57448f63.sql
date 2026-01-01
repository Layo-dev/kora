-- Add DELETE policy for likes table
-- Users can only delete likes they sent
CREATE POLICY "Users can delete own likes"
ON public.likes
FOR DELETE
TO authenticated
USING (auth.uid() = liker_id);