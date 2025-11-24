import { X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeActionsProps {
  onReject: () => void;
  onLike: () => void;
}

export const SwipeActions = ({ onReject, onLike }: SwipeActionsProps) => {
  return (
    <div className="fixed bottom-24 left-0 right-0 flex items-center justify-center gap-8 z-50">
      <button
        onClick={onReject}
        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Pass"
      >
        <X className="w-8 h-8 text-gray-800" strokeWidth={3} />
      </button>
      
      <button
        onClick={onLike}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Like"
      >
        <Heart className="w-10 h-10 text-white" fill="white" strokeWidth={0} />
      </button>
    </div>
  );
};
