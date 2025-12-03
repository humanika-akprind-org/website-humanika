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
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt="Management photo"
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML =
              '<div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
          }
        }}
      />
    </div>
  );
}
