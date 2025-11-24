import { BottomNav } from "@/components/BottomNav";
import { ProfileCard } from "@/components/ProfileCard";
import { Zap, Settings, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profiles } from "@/data/profiles";

const Index = () => {
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

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              name={profile.name}
              age={profile.age}
              image={profile.image}
              isOnline={profile.isOnline}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
