import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  photo_url: string;
  is_primary: boolean;
}

interface PhotoGridProps {
  photos: Photo[];
  userId: string;
  onPhotosChange: () => void;
}

export const PhotoGrid = ({ photos, userId, onPhotosChange }: PhotoGridProps) => {
  const [uploading, setUploading] = useState<number | null>(null);

  const primaryPhoto = photos.find((p) => p.is_primary) || photos[0];
  const otherPhotos = photos.filter((p) => p.id !== primaryPhoto?.id);

  const handleUpload = async (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploading(index);

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("photos")
          .getPublicUrl(fileName);

        const isPrimary = photos.length === 0 && index === 0;

        const { error: insertError } = await supabase.from("photos").insert({
          user_id: userId,
          photo_url: urlData.publicUrl,
          is_primary: isPrimary,
        });

        if (insertError) throw insertError;

        // After upload, recompute primary photo and sync profile avatar_url
        try {
          const { data: updatedPhotos } = await supabase
            .from("photos")
            .select("*")
            .eq("user_id", userId)
            .order("is_primary", { ascending: false });

          if (updatedPhotos && updatedPhotos.length > 0) {
            const primary =
              updatedPhotos.find((p: any) => p.is_primary) ?? updatedPhotos[0];

            await supabase
              .from("profiles")
              .update({ avatar_url: primary.photo_url })
              .eq("id", userId);
          }
        } catch (syncError) {
          console.error("Failed to sync avatar_url after upload", syncError);
        }

        toast({ title: "Photo uploaded successfully" });
        onPhotosChange();
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(null);
      }
    };
    input.click();
  };

  const handleDelete = async (photoId: string, photoUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = photoUrl.split("/photos/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("photos").remove([filePath]);
      }

      const { error } = await supabase.from("photos").delete().eq("id", photoId);
      if (error) throw error;

      // After delete, recompute primary photo and sync profile avatar_url
      try {
        const { data: remaining } = await supabase
          .from("photos")
          .select("*")
          .eq("user_id", userId)
          .order("is_primary", { ascending: false });

        if (!remaining || remaining.length === 0) {
          // No photos left → clear avatar_url
          await supabase
            .from("profiles")
            .update({ avatar_url: null })
            .eq("id", userId);
        } else {
          let primary =
            remaining.find((p: any) => p.is_primary) ?? remaining[0];

          // Ensure exactly one primary
          if (!primary.is_primary) {
            await supabase
              .from("photos")
              .update({ is_primary: false })
              .eq("user_id", userId);

            await supabase
              .from("photos")
              .update({ is_primary: true })
              .eq("id", primary.id);
          }

          await supabase
            .from("profiles")
            .update({ avatar_url: primary.photo_url })
            .eq("id", userId);
        }
      } catch (syncError) {
        console.error("Failed to sync avatar_url after delete", syncError);
      }

      toast({ title: "Photo deleted" });
      onPhotosChange();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderPhotoSlot = (
    photo: Photo | undefined,
    index: number,
    large?: boolean
  ) => {
    const isUploading = uploading === index;

    if (photo) {
      return (
        <div
          className={`relative rounded-2xl overflow-hidden bg-muted ${
            large ? "aspect-[3/4]" : "aspect-square"
          }`}
        >
          <img
            src={photo.photo_url}
            alt="Profile photo"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => handleDelete(photo.id, photo.photo_url)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          {large && (
            <button className="absolute bottom-3 left-3 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI enhance
            </button>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => handleUpload(index)}
        disabled={isUploading}
        className={`rounded-2xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors ${
          large ? "aspect-[3/4]" : "aspect-square"
        }`}
      >
        {isUploading ? (
          <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        ) : (
          <Plus className="w-6 h-6 text-muted-foreground" />
        )}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Large primary photo - spans 2 rows */}
      <div className="col-span-2 row-span-2">
        {renderPhotoSlot(primaryPhoto, 0, true)}
      </div>

      {/* 5 smaller photo slots */}
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index}>{renderPhotoSlot(otherPhotos[index - 1], index)}</div>
      ))}
    </div>
  );
};
