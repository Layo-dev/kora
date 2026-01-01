-- Recreate handle_like function with fixed search_path
CREATE OR REPLACE FUNCTION public.handle_like(liker uuid, liked uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  -- Check if mutual like exists
  if exists (
    select 1
    from likes
    where liker_id = liked
      and liked_id = liker
  ) then

    -- Create match
    insert into matches (user1_id, user2_id)
    values (liker, liked)
    on conflict do nothing;

    -- Optional: clean up likes
    delete from likes
    where (liker_id = liker and liked_id = liked)
       or (liker_id = liked and liked_id = liker);

  end if;
end;
$function$;