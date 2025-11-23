import { BottomNav } from "@/components/BottomNav";
import { ProfileCard } from "@/components/ProfileCard";
import { Zap, Settings, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";
import profile5 from "@/assets/profile-5.jpg";
import profile6 from "@/assets/profile-6.jpg";

const profiles = [
  { id: 1, name: "Vicki", age: 27, image: profile1, isOnline: true },
  { id: 2, name: "Jennifer", age: 24, image: profile2, isOnline: false },
  { id: 3, name: "Mirable", age: 26, image: profile3, isOnline: false },
  { id: 4, name: "Anita", age: 25, image: profile4, isOnline: false },
  { id: 5, name: "Gift", age: 30, image: profile5, isOnline: false },
  { id: 6, name: "Princess", age: 26, image: profile6, isOnline: true },
];

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
