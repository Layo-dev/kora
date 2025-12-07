import { BottomNav } from "@/components/BottomNav";
import { Settings, Edit, CheckCircle2, ChevronRight, Activity, Coins, Shield, BadgeCheck, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import profileUser from "@/assets/profile-user.jpg";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Edit className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card">
              <img
                src={profileUser}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold border-2 border-background">
              13%
            </div>
          </div>
          <div className="flex-1 pt-2">
            <h2 className="text-2xl font-bold text-foreground mb-1">Donald, 25</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="text-foreground">☕</span> Here to date
            </p>
          </div>
        </div>

        {/* Verification Banner */}
        <div className="bg-card rounded-2xl p-4 mb-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <span className="font-semibold text-foreground">Stand out - get verified!</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="w-full bg-card rounded-xl p-1 mb-6">
            <TabsTrigger value="plans" className="flex-1 rounded-lg data-[state=active]:bg-background">
              Plans
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex-1 rounded-lg data-[state=active]:bg-background">
              Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid grid-cols-2 gap-4">
              {/* Activity Card */}
              <div className="bg-card rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Activity</p>
                <p className="text-lg font-bold text-destructive">Low</p>
              </div>

              {/* Credits Card */}
              <div className="bg-card rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Credits</p>
                <p className="text-lg font-bold text-foreground">Add</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safety">
            <div className="space-y-2">
              {/* Get help */}
              <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-foreground">Get help from Badoo</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* Verify your profile */}
              <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">Verify your profile</span>
                      <span className="text-sm text-muted-foreground">Let everyone know you're real</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* Turn on invisible mode */}
              <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EyeOff className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground block">Turn on invisible mode</span>
                      <span className="text-sm text-muted-foreground">Go invisible to browse privately</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* Manage your privacy */}
              <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground block">Manage your privacy</span>
                      <span className="text-sm text-muted-foreground">Choose what information you share</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
