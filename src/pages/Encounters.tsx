import { BottomNav } from "@/components/BottomNav";

const Encounters = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Encounters</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-center">Start swiping to find matches!</p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Encounters;
