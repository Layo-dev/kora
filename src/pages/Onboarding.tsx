import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type OnboardingStep = "intro" | "intent" | "photos";
type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";
type Intent = "dating" | "chat" | "relationship";

interface IntentOption {
  id: Intent;
  emoji: string;
  title: string;
  description: string;
}

const intentOptions: IntentOption[] = [
  {
    id: "dating",
    emoji: "☕",
    title: "Here to date",
    description: "I want to go on dates and have a good time. No labels.",
  },
  {
    id: "chat",
    emoji: "💬",
    title: "Open to chat",
    description: "I'm here to chat and see where it goes. No pressure.",
  },
  {
    id: "relationship",
    emoji: "💜",
    title: "Ready for a relationship",
    description: "I'm looking for something that lasts. No games.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("intro");
  const [showMoreGenders, setShowMoreGenders] = useState(false);
  
  // Form state
  const [gender, setGender] = useState<Gender | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setUserId(user.id);

      // Ensure a profile row exists for this user with onboarding incomplete
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, onboarding_complete: false },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error("Error ensuring profile exists:", profileError);
      }
    };

    initOnboarding();
  }, [navigate]);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleIntroSubmit = () => {
    if (!gender) {
      toast({ title: "Please select your gender", variant: "destructive" });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    if (!birthday) {
      toast({ title: "Please enter your birthday", variant: "destructive" });
      return;
    }
    
    const age = calculateAge(birthday);
    if (age < 18) {
      toast({ title: "You must be 18 or older to use Kora", variant: "destructive" });
      return;
    }
    
    setStep("intent");
  };

  const handleIntentSubmit = () => {
    if (!intent) {
      toast({ title: "Please select why you're here", variant: "destructive" });
      return;
    }
    setStep("photos");
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newPhotos = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 2));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleCompleteOnboarding = async () => {
    if (photos.length < 2) {
      toast({ title: "Please add at least 2 photos", variant: "destructive" });
      return;
    }

    if (!userId) {
      toast({ title: "Authentication error", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // Upload photos to Supabase Storage
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const fileExt = photo.file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${i}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, photo.file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(publicUrl);
      }

      // Insert photo records
      for (let i = 0; i < uploadedUrls.length; i++) {
        const { error: photoError } = await supabase
          .from('photos')
          .insert({
            user_id: userId,
            photo_url: uploadedUrls[i],
            is_primary: i === 0,
          });
        
        if (photoError) throw photoError;
      }

      // Update profile
      const age = calculateAge(birthday);
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: name.trim(),
          age,
          gender,
          intent,
          avatar_url: uploadedUrls[0],
          onboarding_complete: true,
        });

      if (profileError) throw profileError;

      toast({ title: "Profile created successfully!" });
      navigate("/encounters");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({ 
        title: "Error completing setup", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "intent") setStep("intro");
    else if (step === "photos") setStep("intent");
    else navigate("/auth");
  };

  const renderGenderOption = (value: Gender, label: string) => (
    <button
      type="button"
      onClick={() => setGender(value)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
        gender === value 
          ? "bg-foreground text-background" 
          : "bg-muted hover:bg-muted/80"
      }`}
    >
      <span className="font-medium">{label}</span>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        gender === value ? "border-background" : "border-muted-foreground"
      }`}>
        {gender === value && <div className="w-2.5 h-2.5 rounded-full bg-background" />}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Step 1: Introduce Yourself */}
        {step === "intro" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Introduce yourself</h1>
              <p className="text-muted-foreground mt-2">
                Fill out the rest of your details so people know a little more about you
              </p>
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
              {renderGenderOption("female", "Female")}
              {renderGenderOption("male", "Male")}
              
              <button
                type="button"
                onClick={() => setShowMoreGenders(!showMoreGenders)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <span className="font-medium text-muted-foreground">More choices</span>
                <ChevronLeft className={`w-5 h-5 text-muted-foreground transition-transform ${showMoreGenders ? "rotate-90" : "-rotate-90"}`} />
              </button>
              
              {showMoreGenders && (
                <div className="space-y-3 pl-4">
                  {renderGenderOption("non-binary", "Non-binary")}
                  {renderGenderOption("prefer-not-to-say", "Prefer not to say")}
                </div>
              )}
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="h-14 rounded-xl text-base"
              />
            </div>

            {/* Birthday Input */}
            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-base font-medium">Birthday</Label>
              <div className="relative">
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="h-14 rounded-xl text-base pr-12"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <Button
              onClick={handleIntroSubmit}
              className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 text-base font-semibold"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Intent Selection */}
        {step === "intent" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Come on in, {name}! Tell people why you're here.
              </h1>
              <p className="text-muted-foreground mt-2">
                Be confident about what you want, and find the right people for you. You can change this anytime.
              </p>
            </div>

            {/* Intent Options */}
            <div className="space-y-3">
              {intentOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setIntent(option.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors text-left ${
                    intent === option.id 
                      ? "bg-foreground text-background" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{option.title}</p>
                    <p className={`text-sm ${intent === option.id ? "text-background/70" : "text-muted-foreground"}`}>
                      {option.description}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    intent === option.id ? "border-background" : "border-muted-foreground"
                  }`}>
                    {intent === option.id && <div className="w-2.5 h-2.5 rounded-full bg-background" />}
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleIntentSubmit}
              className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 text-base font-semibold"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 3: Photo Upload */}
        {step === "photos" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Add your first 2 photos</h1>
              <p className="text-muted-foreground mt-2">
                Conversation starters make it easy! Let's see you with pets, great food, or on a trip.
              </p>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div key={index} className="aspect-[3/4] relative">
                  {photos[index] ? (
                    <div className="w-full h-full relative rounded-2xl overflow-hidden">
                      <img
                        src={photos[index].preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-foreground/80 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-background" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full bg-muted rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-muted/80 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                        <Plus className="w-6 h-6 text-background" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Add photo</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <Button
              onClick={handleCompleteOnboarding}
              disabled={isLoading || photos.length < 2}
              className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 text-base font-semibold disabled:opacity-50"
            >
              {isLoading ? "Setting up..." : "Add photos"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
