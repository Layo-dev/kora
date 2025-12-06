import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Heart, GraduationCap, MoreHorizontal, X } from "lucide-react";
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

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe("left");
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe("right");
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-4 top-8 bottom-8 bg-card rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing transition-transform",
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

      {/* Compact View - Top Overlay with Name & Actions at Bottom */}
      {!isExpanded && (
        <>
          {/* Top gradient for text visibility */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          
          {/* Top Left - Name, Age, Relationship Goal */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div>
              <h2 className="text-accent text-2xl font-bold drop-shadow-lg">
                {profile.name}, {profile.age}
              </h2>
              {profile.relationshipGoal && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">
                    {profile.relationshipGoal}
                  </span>
                </div>
              )}
            </div>
            
            {/* Top Right - Menu Icon */}
            <button 
              className="p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
          </div>

          {/* Bottom - Action Buttons */}
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
            <button
              onClick={handleReject}
              className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              aria-label="Pass"
            >
              <X className="w-7 h-7 text-white" strokeWidth={2.5} />
            </button>
            
            <button
              onClick={handleLike}
              className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              aria-label="Like"
            >
              <Heart className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
            </button>
          </div>
        </>
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
