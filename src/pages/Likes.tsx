import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X, Heart, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles">;
type PhotoRow = Tables<"photos">;
type LikeRow = Tables<"likes">;
type MatchRow = Tables<"matches">;

type LikeWithProfile = LikeRow & {
  liker: ProfileRow & {
    photos: PhotoRow[];
  };
};

const Likes = () => {
  const [likes, setLikes] = useState<LikeWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadLikes = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setLikes([]);
        setLoading(false);
        return;
      }

      const userId = userData.user.id;
      setCurrentUserId(userId);

      // Fetch matches to exclude already-matched users
      const { data: matchesData } = await supabase
        .from("matches")
        .select("user1, user2")
        .or(`user1.eq.${userId},user2.eq.${userId}`);

      const matchedIds = new Set<string>();
      (matchesData as MatchRow[] | null | undefined)?.forEach((m) => {
        if (m.user1 && m.user1 !== userId) matchedIds.add(m.user1);
        if (m.user2 && m.user2 !== userId) matchedIds.add(m.user2);
      });

      // Fetch likes where current user was liked (liked_id = current user)
      const { data: likesData, error } = await supabase
        .from("likes")
        .select(
          `
          id,
          created_at,
          liker_id,
          liked_id,
          liker:profiles!likes_liker_id_fkey (
            id,
            full_name,
            age,
            photos:photos (
              id,
              photo_url,
              is_primary
            )
          )
        `
        )
        .eq("liked_id", userId)
        .order("created_at", { ascending: false });

      if (error || !likesData) {
        setLikes([]);
        setLoading(false);
        return;
      }

      // Filter out matched users and map to proper type
      const filteredLikes = (likesData as any[])
        .filter((like) => {
          const likerId = like.liker_id;
          return likerId && !matchedIds.has(likerId) && like.liker;
        })
        .map((like) => ({
          ...like,
          liker: like.liker as ProfileRow & { photos: PhotoRow[] },
        })) as LikeWithProfile[];

      setLikes(filteredLikes);
      setLoading(false);
    };

    void loadLikes();
  }, []);

  const formatTimeAgo = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const handlePass = async (likeId: string, likerId: string) => {
    if (!currentUserId) return;

    try {
      // Delete the like (they passed, so remove it from their likes list)
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", likeId);

      if (error) {
        console.error("Error passing:", error);
        toast({
          title: "Error",
          description: "Failed to pass. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Remove from local state
      setLikes((prev) => prev.filter((l) => l.id !== likeId));
      toast({
        title: "Passed",
        description: "Profile removed from your likes",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (likeId: string, likerId: string, likerName: string) => {
    if (!currentUserId || !likerId) return;

    try {
      // Check if like already exists (prevent duplicate)
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("liker_id", currentUserId)
        .eq("liked_id", likerId)
        .maybeSingle();

      if (existingLike) {
        // Like already exists, proceed to match creation
        console.log("Like already exists, proceeding to match");
      } else {
        // Create a like back (mutual like = match)
        const { error: likeError } = await supabase
          .from("likes")
          .insert({
            liker_id: currentUserId,
            liked_id: likerId,
          });

        if (likeError) {
          console.error("Error creating like:", likeError);
          
          // Check if it's a duplicate error (unique constraint violation)
          if (likeError.code === "23505" || likeError.message.includes("duplicate")) {
            // Like already exists, proceed to match creation
            console.log("Duplicate like detected, proceeding to match");
          } else {
            toast({
              title: "Error",
              description: `Failed to like back: ${likeError.message}`,
              variant: "destructive",
            });
            return;
          }
        }
      }

      // Check if match already exists
      const [user1, user2] =
        currentUserId < likerId
          ? [currentUserId, likerId]
          : [likerId, currentUserId];

      const { data: existingMatch } = await supabase
        .from("matches")
        .select("id")
        .eq("user1", user1)
        .eq("user2", user2)
        .maybeSingle();

      if (existingMatch) {
        // Match already exists, just remove from list
        setLikes((prev) => prev.filter((l) => l.id !== likeId));
        toast({
          title: "Already Matched! 💜",
          description: `You and ${likerName} are already matched!`,
          duration: 3000,
        });
        return;
      }

      // Create match record
      const { error: matchError } = await supabase
        .from("matches")
        .insert({
          user1,
          user2,
        });

      if (matchError) {
        console.error("Error creating match:", matchError);
        
        // Check if it's a duplicate match error
        if (matchError.code === "23505" || matchError.message.includes("duplicate")) {
          // Match already exists, just remove from list
          setLikes((prev) => prev.filter((l) => l.id !== likeId));
          toast({
            title: "Already Matched! 💜",
            description: `You and ${likerName} are already matched!`,
            duration: 3000,
          });
          return;
        }
        
        toast({
          title: "Error",
          description: `Failed to create match: ${matchError.message}`,
          variant: "destructive",
        });
        return;
      }

      // Remove from local state (it's now a match, not just a like)
      setLikes((prev) => prev.filter((l) => l.id !== likeId));

      // Show match notification
      toast({
        title: "🎉 It's a Match!",
        description: `You and ${likerName} liked each other!`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Your likes list</h1>
          <p className="text-sm text-muted-foreground mt-1">
            The faster you like them back, the higher your chance of chatting and dating!
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : likes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 min-h-[60vh]">
            <p className="text-muted-foreground text-center mb-4">
              No likes yet. Keep swiping!
            </p>
            <Button
              onClick={() => (window.location.href = "/encounters")}
              className="rounded-full"
            >
              Start Swiping
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <Button className="w-full max-w-sm rounded-full bg-foreground text-background hover:bg-foreground/90">
                Reveal my likes
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {likes.map((like) => {
                const liker = like.liker;
                const primaryPhoto =
                  liker.photos?.find((p) => p.is_primary) ?? liker.photos?.[0];
                const photoUrl = primaryPhoto?.photo_url || "";

                return (
                  <div
                    key={like.id}
                    className="bg-card rounded-2xl overflow-hidden shadow-sm relative"
                  >
                    {/* Blurred Profile Image */}
                    <div className="relative aspect-[3/4]">
                      <img
                        src={photoUrl}
                        alt={`${liker.full_name || "Profile"}'s profile`}
                        className="w-full h-full object-cover blur-md scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      
                      {/* Time Badge */}
                      {like.created_at && (
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-white text-xs font-medium">
                              {formatTimeAgo(like.created_at)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                      <div className="flex items-center justify-center gap-4">
                        {/* Pass Button */}
                        <button
                          onClick={() => handlePass(like.id, like.liker_id!)}
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                          aria-label="Pass"
                        >
                          <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </button>

                        {/* Like Button */}
                        <button
                          onClick={() =>
                            handleLike(
                              like.id,
                              like.liker_id!,
                              liker.full_name || "Someone"
                            )
                          }
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                          aria-label="Like"
                        >
                          <Heart className="w-6 h-6 text-white" fill="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Likes;
