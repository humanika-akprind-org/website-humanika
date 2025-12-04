import type { Management } from "@/types/management";
import Image from "next/image";

interface ManagementAvatarProps {
  management: Management;
}

export default function ManagementAvatar({
  management,
}: ManagementAvatarProps) {
  // Get image URL from management photo (file ID or URL)
  const getImageUrl = (photoUrl: string | null | undefined): string => {
    if (!photoUrl) return "";

    if (photoUrl.includes("drive.google.com")) {
      const fileIdMatch = photoUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
      return photoUrl;
    } else if (photoUrl.match(/^[a-zA-Z0-9_-]+$/)) {
      return `https://drive.google.com/uc?export=view&id=${photoUrl}`;
    } else {
      return photoUrl;
    }
  };

  const imageUrl = getImageUrl(management.photo);

  if (!imageUrl) {
    return (
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
        <svg
          className="w-8 h-8 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt="Management photo"
        width={48}
        height={48}
        className="h-16 w-16 rounded-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML =
              '<div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200"><svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
          }
        }}
      />
    </div>
  );
}
