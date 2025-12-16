import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ProfileCard } from "@/components/ProfileCard";
import { Zap, Settings, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles">;
type PhotoRow = Tables<"photos">;
type MatchRow = Tables<"matches">;
type ReportRow = Tables<"reports">;

type ProfileWithPhotos = ProfileRow & { photos: PhotoRow[] };

const Nearby = () => {
  const [profiles, setProfiles] = useState<ProfileWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const currentUserId = userData.user.id;

      const { data: matchesData } = await supabase
        .from("matches")
        .select("user1, user2")
        .or(`user1.eq.${currentUserId},user2.eq.${currentUserId}`);

      const matchedIds = new Set<string>();
      (matchesData as MatchRow[] | null | undefined)?.forEach((m) => {
        if (m.user1 && m.user1 !== currentUserId) matchedIds.add(m.user1);
        if (m.user2 && m.user2 !== currentUserId) matchedIds.add(m.user2);
      });

      const { data: reportsData } = await supabase
        .from("reports")
        .select("reported_id")
        .eq("reporter_id", currentUserId);

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
        .neq("id", currentUserId);

      if (error || !rawProfiles) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const filtered = (rawProfiles as any as ProfileWithPhotos[]).filter((p) => {
        const photoCount = p.photos?.length ?? 0;
        if (!p.full_name || p.age === null) return false;
        if (photoCount < 2) return false;
        if (matchedIds.has(p.id)) return false;
        if (blockedIds.has(p.id)) return false;
        return true;
      });

      setProfiles(filtered);
      setLoading(false);
    };

    void loadProfiles();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        </div>
      );
    }

    if (profiles.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground text-center">
            No nearby people to show right now. Check back later!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {profiles.map((profile) => {
          const primary =
            profile.photos.find((p) => p.is_primary) ?? profile.photos[0];
          return (
            <ProfileCard
              key={profile.id}
              name={profile.full_name!}
              age={profile.age!}
              image={primary.photo_url}
              isOnline={false}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Nearby</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Zap className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-foreground" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-background">
                    0
                  </span>
                </div>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Shuffle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">{renderContent()}</main>

      <BottomNav />
    </div>
  );
};

export default Nearby;
