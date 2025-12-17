import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { SwipeCard } from "@/components/SwipeCard";
import { Zap, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles">;
type PhotoRow = Tables<"photos">;
type MatchRow = Tables<"matches">;
type ReportRow = Tables<"reports">;
type LikeRow = Tables<"likes">;

type ProfileWithPhotos = ProfileRow & { photos: PhotoRow[] };

type SwipeProfile = {
  id: string;
  name: string;
  age: number;
  image: string;
  isOnline?: boolean;
  verified?: boolean;
  relationshipGoal?: string;
  aboutMe?: string;
  personalInfo?: {
    relationshipStatus?: string;
    orientation?: string;
    familyPlans?: string;
    smoking?: string;
    drinking?: string;
    language?: string;
    education?: string;
    personality?: string;
  };
  education?: string;
  interests?: string[];
  location?: string;
};

const Encounters = () => {
  const [profiles, setProfiles] = useState<SwipeProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const userId = userData.user.id;
      setCurrentUserId(userId);

      // Fetch matches involving current user
      const { data: matchesData } = await supabase
        .from("matches")
        .select("user1, user2")
        .or(`user1.eq.${userId},user2.eq.${userId}`);

      const matchedIds = new Set<string>();
      (matchesData as MatchRow[] | null | undefined)?.forEach((m) => {
        if (m.user1 && m.user1 !== userId) matchedIds.add(m.user1);
        if (m.user2 && m.user2 !== userId) matchedIds.add(m.user2);
      });

      // Fetch likes made by current user (to exclude already-liked profiles)
      const { data: likesData } = await supabase
        .from("likes")
        .select("liked_id")
        .eq("liker_id", userId);

      const likedIds = new Set<string>(
        (likesData as LikeRow[] | null | undefined)
          ?.map((l) => l.liked_id)
          .filter((id): id is string => !!id) ?? []
      );

      // Fetch blocked users (reports)
      const { data: reportsData } = await supabase
        .from("reports")
        .select("reported_id")
        .eq("reporter_id", userId);

      const blockedIds = new Set<string>(
        (reportsData as ReportRow[] | null | undefined)
          ?.map((r) => r.reported_id)
          .filter((id): id is string => !!id) ?? []
      );

      const { data: rawProfiles, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          age,
          bio,
          intent,
          education,
          interests,
          location,
          onboarding_complete,
          photos:photos (
            id,
            photo_url,
            is_primary
          )
        `
        )
        .eq("onboarding_complete", true)
        .neq("id", userId);

      if (error || !rawProfiles) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const mapped = (rawProfiles as any as ProfileWithPhotos[])
        .filter((p) => {
          const photoCount = p.photos?.length ?? 0;
          if (!p.full_name || p.age === null) return false;
          if (photoCount < 2) return false;
          if (matchedIds.has(p.id)) return false; // Already matched
          if (likedIds.has(p.id)) return false; // Already liked
          if (blockedIds.has(p.id)) return false; // Blocked
          return true;
        })
        .map<SwipeProfile>((p) => {
          const primary = p.photos.find((ph) => ph.is_primary) ?? p.photos[0];
          return {
            id: p.id,
            name: p.full_name!,
            age: p.age!,
            image: primary.photo_url,
            relationshipGoal: p.intent ?? undefined,
            aboutMe: p.bio ?? undefined,
            education: p.education ?? undefined,
            interests: p.interests ?? undefined,
            location: p.location ?? undefined,
            personalInfo: undefined,
          };
        });

      setProfiles(mapped);
      setCurrentIndex(0);
      setLoading(false);
    };

    void loadProfiles();
  }, []);

  /**
   * Handles swipe actions (like/pass) and match detection
   */
  const handleSwipe = async (direction: "left" | "right") => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile || !currentUserId) return;

    if (direction === "right") {
      // LIKE: Create a like record
      try {
        const { error: likeError } = await supabase
          .from("likes")
          .insert({
            liker_id: currentUserId,
            liked_id: currentProfile.id,
          });

        if (likeError) {
          console.error("Error creating like:", likeError);
          toast({
            title: "Error",
            description: "Failed to record your like. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Check for mutual like (match detection)
        const { data: mutualLike } = await supabase
          .from("likes")
          .select("id")
          .eq("liker_id", currentProfile.id)
          .eq("liked_id", currentUserId)
          .maybeSingle();

        if (mutualLike) {
          // MATCH! Create match record via Edge Function
          // Ensure consistent ordering: user1 < user2
          const [user1, user2] = 
            currentUserId < currentProfile.id
              ? [currentUserId, currentProfile.id]
              : [currentProfile.id, currentUserId];

          const { error: matchError } = await supabase.functions.invoke("create-match", {
            body: {
              user1,
              user2,
            },
          });

          if (matchError) {
            console.error("Error creating match:", matchError);
            // Still show match toast even if DB insert fails
          }

          // Show match notification
          toast({
            title: "🎉 It's a Match!",
            description: `You and ${currentProfile.name} liked each other!`,
            duration: 5000,
          });
        } else {
          // Regular like (no match yet)
          toast({
            title: "Liked! 💜",
            description: `You liked ${currentProfile.name}`,
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // PASS (swipe left): No database action needed
      // Optionally, you could track passes here if you add a "passes" table
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast({
        title: "No more profiles",
        description: "Check back later for more matches!",
      });
    }
  };

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Encounters</h1>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto relative h-[calc(100vh-10rem)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center text-lg">
              No more profiles to show.
              <br />
              Check back later!
            </p>
          </div>
        ) : (
          <>
          
            {nextProfile && (
              <div className="absolute inset-4 top-8 bottom-8 bg-card rounded-3xl overflow-hidden shadow-lg opacity-50 scale-95">
                <img
                  src={nextProfile.image}
                  alt={nextProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}


            {currentProfile && (
              <SwipeCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={handleSwipe}
              />
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Encounters;
