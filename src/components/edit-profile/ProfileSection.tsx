import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ProfileSectionProps {
  title?: string;
  description?: string;
  onClick?: () => void;
  children?: ReactNode;
  rightElement?: ReactNode;
  icon?: ReactNode;
  showChevron?: boolean;
}

export const ProfileSection = ({
  title,
  description,
  onClick,
  children,
  rightElement,
  icon,
  showChevron = true,
}: ProfileSectionProps) => {
  return (
    <div
      className={`bg-card rounded-2xl p-4 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {icon && (
              <div className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <span className="font-semibold text-foreground block">{title}</span>
              )}
              {description && (
                <span className="text-sm text-muted-foreground">{description}</span>
              )}
            </div>
          </div>
          {rightElement}
          {showChevron && onClick && (
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
          )}
        </div>
      )}
    </div>
  );
};

interface AttributeRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

export const AttributeRow = ({ icon, label, value, onClick }: AttributeRowProps) => {
  return (
    <div
      className={`flex items-center justify-between py-3 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">{value || "Add"}</span>
        {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  );
};
