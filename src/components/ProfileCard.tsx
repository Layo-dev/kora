import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  age: number;
  image: string;
  isOnline?: boolean;
  onClick?: () => void;
}

export const ProfileCard = ({ name, age, image, isOnline, onClick }: ProfileCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm"
    >
      <div className="relative aspect-[3/4]">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-lg">
              {name}, {age}
            </h3>
            {isOnline && (
              <div className="w-2.5 h-2.5 rounded-full bg-online border-2 border-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
