import { MapPin, Zap, Heart, MessageCircle, User } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: MapPin, label: "Nearby", path: "/nearby" },
  { icon: Zap, label: "Encounters", path: "/encounters" },
  { icon: Heart, label: "Likes", path: "/likes", badge: 0 },
  { icon: MessageCircle, label: "Chats", path: "/chats", badge: 2 },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors relative"
              activeClassName="text-foreground"
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
