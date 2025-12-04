import type { Management } from "@/types/management";
import Image from "next/image";

interface ManagementAvatarProps {
  management: Management;
  accessToken?: string;
}

export default function ManagementAvatar({
  management,
  accessToken,
}: ManagementAvatarProps) {
  // Extract file ID from Google Drive URL for proxy image
  const extractFileId = (url: string): string | null => {
    if (!url) return null;

    // Handle direct file IDs
    if (url.length === 33 && !url.includes("/")) {
      return url;
    }

    // Handle Google Drive URLs
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /uc\?export=view&id=([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Generate proxy image URL
  const getProxyImageUrl = (photoUrl: string | null): string | null => {
    if (!photoUrl) return null;

    const fileId = extractFileId(photoUrl);
    if (!fileId) return null;

    // Validate fileId format (Google Drive file IDs are typically 33 characters)
    if (fileId.length !== 33) return null;

    let url = `/api/drive-image?fileId=${encodeURIComponent(fileId)}`;
    if (accessToken) {
      url += `&accessToken=${encodeURIComponent(accessToken)}`;
    }

    return url;
  };

  const imageUrl = getProxyImageUrl(management.photo || null);

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
