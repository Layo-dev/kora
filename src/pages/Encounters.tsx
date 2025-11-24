import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { SwipeCard } from "@/components/SwipeCard";
import { SwipeActions } from "@/components/SwipeActions";
import { profiles } from "@/data/profiles";
import { Zap, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Encounters = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      toast({
        title: "It's a match! ❤️",
        description: `You liked ${profiles[currentIndex].name}`,
      });
    }
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
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
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <Zap className="w-5 h-5 text-primary" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto relative h-[calc(100vh-12rem)]">
        {currentIndex >= profiles.length ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center text-lg">
              No more profiles to show.<br />
              Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* Background card (next profile) */}
            {nextProfile && (
              <div className="absolute inset-4 top-20 bottom-32 bg-card rounded-3xl overflow-hidden shadow-lg opacity-50 scale-95">
                <img
                  src={nextProfile.image}
                  alt={nextProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Current card */}
            {currentProfile && (
              <SwipeCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={handleSwipe}
              />
            )}

            <SwipeActions
              onReject={() => handleSwipe("left")}
              onLike={() => handleSwipe("right")}
            />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Encounters;
