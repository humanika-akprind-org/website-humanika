import Image from "next/image";
import { FiImage } from "react-icons/fi";

// Helper function to get preview URL from thumbnail (file ID or URL)
const getThumbnailUrl = (thumbnail: string | null | undefined): string => {
  if (!thumbnail) return "";

  if (thumbnail.includes("drive.google.com")) {
    const fileIdMatch = thumbnail.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return thumbnail;
  } else if (thumbnail.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${thumbnail}`;
  } else {
    return thumbnail;
  }
};

interface ThumbnailCellProps {
  thumbnail: string | null | undefined;
  name: string;
  categoryName?: string;
}

export default function ThumbnailCell({
  thumbnail,
  name,
  categoryName,
}: ThumbnailCellProps) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        {thumbnail ? (
          <Image
            className="h-10 w-10 rounded-lg object-cover"
            src={getThumbnailUrl(thumbnail)}
            alt={name}
            width={40}
            height={40}
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <FiImage className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">
          {categoryName || "No category"}
        </div>
      </div>
    </div>
  );
}
