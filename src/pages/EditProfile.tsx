import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, Briefcase, GraduationCap, BadgeCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PhotoGrid } from "@/components/edit-profile/PhotoGrid";
import { ProfileSection, AttributeRow } from "@/components/edit-profile/ProfileSection";
import {
  EditTextSheet,
  EditBioSheet,
  EditSelectSheet,
  EditInterestsSheet,
  attributeOptions,
  interestOptions,
} from "@/components/edit-profile/EditSheets";

interface ProfileData {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  location: string | null;
  bio: string | null;
  intent: string | null;
  interests: string[] | null;
  work: string | null;
  education: string | null;
  relationship_status: string | null;
  sexuality: string | null;
  children: string | null;
  smoking: string | null;
  drinking: string | null;
  languages: string[] | null;
  height: number | null;
  star_sign: string | null;
  pets: string | null;
  religion: string | null;
  personality: string | null;
  education_level: string | null;
}

interface Photo {
  id: string;
  photo_url: string;
  is_primary: boolean;
}

type SheetType =
  | "name"
  | "gender"
  | "location"
  | "bio"
  | "intent"
  | "work"
  | "education"
  | "interests"
  | "relationship_status"
  | "sexuality"
  | "children"
  | "smoking"
  | "drinking"
  | "height"
  | "star_sign"
  | "pets"
  | "religion"
  | "personality"
  | "education_level"
  | null;

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const fetchData = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate("/auth");
      return;
    }

    const [profileRes, photosRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle(),
      supabase
        .from("photos")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("is_primary", { ascending: false }),
    ]);

    if (profileRes.data) setProfile(profileRes.data as ProfileData);
    if (photosRes.data) setPhotos(photosRes.data);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProfile = async (field: string, value: any) => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", profile.id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
      toast({ title: "Profile updated" });
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.full_name,
      profile.bio,
      profile.gender,
      profile.intent,
      profile.work,
      profile.education,
      profile.relationship_status,
      profile.sexuality,
      profile.smoking,
      profile.drinking,
      photos.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const getDisplayValue = (field: string, value: string | null) => {
    if (!value) return undefined;
    const options = attributeOptions[field as keyof typeof attributeOptions];
    if (options) {
      const option = options.find((o) => o.value === value);
      return option?.label;
    }
    return value;
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-card z-40 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-sm text-muted-foreground">
              {calculateCompletion()}% complete
            </span>
            <Button variant="ghost" size="sm" className="text-primary font-semibold">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Photo Grid */}
        <PhotoGrid photos={photos} userId={profile.id} onPhotosChange={fetchData} />

        {/* Basic Info */}
        <ProfileSection onClick={() => setActiveSheet("name")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                {profile.full_name || "Add name"}
                {profile.age ? `, ${profile.age}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {getDisplayValue("gender", profile.gender) || "Add gender"}
                {profile.location ? ` · ${profile.location}` : ""}
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Work & Education */}
        <ProfileSection onClick={() => setActiveSheet("work")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Work & Education</p>
              <p className="text-sm text-muted-foreground">
                {profile.work || profile.education
                  ? `${profile.work || ""}${profile.work && profile.education ? " · " : ""}${profile.education || ""}`
                  : "Add your job and school"}
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Why You're Here */}
        <ProfileSection
          title="Why you're here"
          description={getDisplayValue("intent", profile.intent) || "Add your intent"}
          onClick={() => setActiveSheet("intent")}
        />

        {/* About Me */}
        <ProfileSection
          title="About me"
          description={profile.bio || "Write something about yourself..."}
          onClick={() => setActiveSheet("bio")}
        />

        {/* More About You */}
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">More about you</h3>
          <div className="divide-y divide-border">
            <AttributeRow
              icon="❤️"
              label="Relationship"
              value={getDisplayValue("relationship_status", profile.relationship_status)}
              onClick={() => setActiveSheet("relationship_status")}
            />
            <AttributeRow
              icon="⚤"
              label="Sexuality"
              value={getDisplayValue("sexuality", profile.sexuality)}
              onClick={() => setActiveSheet("sexuality")}
            />
            <AttributeRow
              icon="👶"
              label="Children"
              value={getDisplayValue("children", profile.children)}
              onClick={() => setActiveSheet("children")}
            />
            <AttributeRow
              icon="🚬"
              label="Smoking"
              value={getDisplayValue("smoking", profile.smoking)}
              onClick={() => setActiveSheet("smoking")}
            />
            <AttributeRow
              icon="🍺"
              label="Drinking"
              value={getDisplayValue("drinking", profile.drinking)}
              onClick={() => setActiveSheet("drinking")}
            />
            <AttributeRow
              icon="📏"
              label="Height"
              value={profile.height ? `${profile.height} cm` : undefined}
              onClick={() => setActiveSheet("height")}
            />
            <AttributeRow
              icon="⭐"
              label="Star sign"
              value={getDisplayValue("star_sign", profile.star_sign)}
              onClick={() => setActiveSheet("star_sign")}
            />
            <AttributeRow
              icon="🐕"
              label="Pets"
              value={getDisplayValue("pets", profile.pets)}
              onClick={() => setActiveSheet("pets")}
            />
            <AttributeRow
              icon="🙏"
              label="Religion"
              value={getDisplayValue("religion", profile.religion)}
              onClick={() => setActiveSheet("religion")}
            />
            <AttributeRow
              icon="🧠"
              label="Personality"
              value={getDisplayValue("personality", profile.personality)}
              onClick={() => setActiveSheet("personality")}
            />
            <AttributeRow
              icon="🎓"
              label="Education level"
              value={getDisplayValue("education_level", profile.education_level)}
              onClick={() => setActiveSheet("education_level")}
            />
          </div>
        </div>

        {/* Interests */}
        <ProfileSection onClick={() => setActiveSheet("interests")}>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Interests</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Connect with people who are into what you're into
            </p>
            {profile.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <Button className="w-full rounded-full">Add interests</Button>
            )}
          </div>
        </ProfileSection>

        {/* Verification */}
        <ProfileSection showChevron={false}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BadgeCheck className="w-6 h-6 text-success" />
              <h3 className="font-semibold text-foreground">Get verified</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Verified profiles get more matches. Show others you're real.
            </p>
            <Button className="w-full rounded-full">
              <BadgeCheck className="w-4 h-4 mr-2" />
              Verify by photo
            </Button>
          </div>
        </ProfileSection>

        {/* Mobile Number */}
        <ProfileSection showChevron={false}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-6 h-6 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Mobile number</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Add your phone number to verify your account
            </p>
            <Button variant="outline" className="w-full rounded-full">
              <Phone className="w-4 h-4 mr-2" />
              Add number
            </Button>
          </div>
        </ProfileSection>
      </main>

      {/* Edit Sheets */}
      <EditTextSheet
        open={activeSheet === "name"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Name"
        initialValue={profile.full_name || ""}
        onSave={(value) => updateProfile("full_name", value)}
      />

      <EditSelectSheet
        open={activeSheet === "gender"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Gender"
        options={attributeOptions.gender}
        initialValue={profile.gender || ""}
        onSave={(value) => updateProfile("gender", value)}
      />

      <EditTextSheet
        open={activeSheet === "location"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Location"
        initialValue={profile.location || ""}
        onSave={(value) => updateProfile("location", value)}
      />

      <EditBioSheet
        open={activeSheet === "bio"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="About me"
        initialValue={profile.bio || ""}
        onSave={(value) => updateProfile("bio", value)}
      />

      <EditSelectSheet
        open={activeSheet === "intent"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Why you're here"
        options={attributeOptions.intent}
        initialValue={profile.intent || ""}
        onSave={(value) => updateProfile("intent", value)}
      />

      <EditTextSheet
        open={activeSheet === "work"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Work"
        initialValue={profile.work || ""}
        onSave={(value) => updateProfile("work", value)}
      />

      <EditTextSheet
        open={activeSheet === "education"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Education"
        initialValue={profile.education || ""}
        onSave={(value) => updateProfile("education", value)}
      />

      <EditSelectSheet
        open={activeSheet === "relationship_status"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Relationship status"
        options={attributeOptions.relationship_status}
        initialValue={profile.relationship_status || ""}
        onSave={(value) => updateProfile("relationship_status", value)}
      />

      <EditSelectSheet
        open={activeSheet === "sexuality"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Sexuality"
        options={attributeOptions.sexuality}
        initialValue={profile.sexuality || ""}
        onSave={(value) => updateProfile("sexuality", value)}
      />

      <EditSelectSheet
        open={activeSheet === "children"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Children"
        options={attributeOptions.children}
        initialValue={profile.children || ""}
        onSave={(value) => updateProfile("children", value)}
      />

      <EditSelectSheet
        open={activeSheet === "smoking"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Smoking"
        options={attributeOptions.smoking}
        initialValue={profile.smoking || ""}
        onSave={(value) => updateProfile("smoking", value)}
      />

      <EditSelectSheet
        open={activeSheet === "drinking"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Drinking"
        options={attributeOptions.drinking}
        initialValue={profile.drinking || ""}
        onSave={(value) => updateProfile("drinking", value)}
      />

      <EditTextSheet
        open={activeSheet === "height"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Height (cm)"
        initialValue={profile.height?.toString() || ""}
        onSave={(value) => updateProfile("height", parseInt(value) || null)}
      />

      <EditSelectSheet
        open={activeSheet === "star_sign"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Star sign"
        options={attributeOptions.star_sign}
        initialValue={profile.star_sign || ""}
        onSave={(value) => updateProfile("star_sign", value)}
      />

      <EditSelectSheet
        open={activeSheet === "pets"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Pets"
        options={attributeOptions.pets}
        initialValue={profile.pets || ""}
        onSave={(value) => updateProfile("pets", value)}
      />

      <EditSelectSheet
        open={activeSheet === "religion"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Religion"
        options={attributeOptions.religion}
        initialValue={profile.religion || ""}
        onSave={(value) => updateProfile("religion", value)}
      />

      <EditSelectSheet
        open={activeSheet === "personality"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Personality type"
        options={attributeOptions.personality}
        initialValue={profile.personality || ""}
        onSave={(value) => updateProfile("personality", value)}
      />

      <EditSelectSheet
        open={activeSheet === "education_level"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        title="Education level"
        options={attributeOptions.education_level}
        initialValue={profile.education_level || ""}
        onSave={(value) => updateProfile("education_level", value)}
      />

      <EditInterestsSheet
        open={activeSheet === "interests"}
        onOpenChange={(open) => !open && setActiveSheet(null)}
        options={interestOptions}
        initialValues={profile.interests || []}
        onSave={(values) => updateProfile("interests", values)}
      />
    </div>
  );
};

export default EditProfile;
