import { Badge } from "@/components/ui/badge";

interface ProfileInfoBadgeProps {
  text: string;
}

export const ProfileInfoBadge = ({ text }: ProfileInfoBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className="bg-purple-50 text-purple-900 border-0 hover:bg-purple-100"
    >
      {text}
    </Badge>
  );
};
