import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Briefcase, Heart, GraduationCap } from "lucide-react";
import { ProfileInfoBadge } from "./ProfileInfoBadge";
import { cn } from "@/lib/utils";

interface Profile {
  id: number;
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
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  style?: React.CSSProperties;
}

export const SwipeCard = ({ profile, onSwipe, style }: SwipeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isExpanded) return;
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart || !isDragging || isExpanded) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left");
    }
    
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-4 top-20 bottom-32 bg-card rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing transition-transform",
        isDragging ? "transition-none" : "transition-all duration-300"
      )}
      style={{
        ...style,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: opacity,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={() => !isDragging && setIsExpanded(!isExpanded)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Swipe Indicators */}
      {dragOffset.x > 50 && (
        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
          <Heart className="w-32 h-32 text-green-500 animate-scale-in" />
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
          <div className="w-32 h-32 text-red-500 text-[120px] font-bold animate-scale-in">×</div>
        </div>
      )}

      {/* Compact View - Bottom Overlay */}
      {!isExpanded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-white text-3xl font-bold">
              {profile.name}, {profile.age}
            </h2>
            {profile.verified && (
              <div className="w-7 h-7 rounded-full bg-verified flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            {profile.isOnline && (
              <div className="w-3 h-3 rounded-full bg-online border-2 border-white" />
            )}
          </div>
          {profile.relationshipGoal && (
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm w-fit">
              {profile.relationshipGoal}
            </Badge>
          )}
        </div>
      )}

      {/* Expanded View - Full Details */}
      {isExpanded && (
        <div className="absolute inset-0 overflow-y-auto bg-background">
          {/* Image at top - clean, no overlay */}
          <div className="relative h-96 flex-shrink-0">
            <img
              src={profile.image}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Scrollable content below image */}
          <div className="bg-background p-6 space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-foreground text-3xl font-bold">
                  {profile.name}, {profile.age}
                </h2>
                {profile.verified && (
                  <div className="w-7 h-7 rounded-full bg-verified flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                {profile.isOnline && (
                  <div className="w-3 h-3 rounded-full bg-online border-2 border-white" />
                )}
              </div>
              {profile.relationshipGoal && (
                <Badge className="bg-purple-100 text-purple-900 border-0">
                  {profile.relationshipGoal}
                </Badge>
              )}
            </div>

            {/* About Me */}
            {profile.aboutMe && (
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-2">About Me</h3>
                <p className="text-muted-foreground">{profile.aboutMe}</p>
              </div>
            )}

            {/* Personal Info */}
            {profile.personalInfo && (
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-3">Personal Info</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.personalInfo.relationshipStatus && (
                    <ProfileInfoBadge text={profile.personalInfo.relationshipStatus} />
                  )}
                  {profile.personalInfo.orientation && (
                    <ProfileInfoBadge text={profile.personalInfo.orientation} />
                  )}
                  {profile.personalInfo.familyPlans && (
                    <ProfileInfoBadge text={profile.personalInfo.familyPlans} />
                  )}
                  {profile.personalInfo.smoking && (
                    <ProfileInfoBadge text={profile.personalInfo.smoking} />
                  )}
                  {profile.personalInfo.drinking && (
                    <ProfileInfoBadge text={profile.personalInfo.drinking} />
                  )}
                  {profile.personalInfo.language && (
                    <ProfileInfoBadge text={profile.personalInfo.language} />
                  )}
                  {profile.personalInfo.education && (
                    <ProfileInfoBadge text={profile.personalInfo.education} />
                  )}
                  {profile.personalInfo.personality && (
                    <ProfileInfoBadge text={profile.personalInfo.personality} />
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Education</p>
                  <p className="text-foreground font-medium">{profile.education}</p>
                </div>
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-purple-50 border-purple-200 text-purple-900"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {profile.location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">{profile.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
