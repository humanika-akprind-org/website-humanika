import Image from "next/image";
import { useState } from "react";
import ViewModal from "@/components/admin/ui/modal/ViewModal";

interface ImageViewProps {
  imageUrl?: string | null;
  alt?: string;
  size?: {
    width: number;
    height: number;
  };
  modalTitle?: string;
}

export default function ImageView({
  imageUrl,
  alt = "Image",
  size,
  modalTitle = "Image Preview",
}: ImageViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default size values
  const defaultWidth = 192;
  const defaultHeight = 192;
  const customWidth = size?.width || defaultWidth;
  const customHeight = size?.height || defaultHeight;

  // Get image URL from imageUrl prop (file ID or URL)
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return "";

    if (imageUrl.includes("drive.google.com")) {
      const fileIdMatch = imageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `/api/drive-image?fileId=${fileIdMatch[1]}`;
      }
      return imageUrl;
    } else if (imageUrl.match(/^[a-zA-Z0-9_-]+$/)) {
      return `/api/drive-image?fileId=${imageUrl}`;
    } else {
      return imageUrl;
    }
  };

  const processedImageUrl = getImageUrl(imageUrl);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!imageUrl) {
    return (
      <div
        className="flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center mx-auto"
        style={{ width: customWidth, height: customHeight }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
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
    <>
      <div
        className="flex-shrink-0 rounded-lg overflow-hidden mx-auto"
        style={{ width: customWidth, height: customHeight }}
      >
        <Image
          src={processedImageUrl}
          alt={alt}
          width={customWidth}
          height={customHeight}
          className="w-full h-full rounded-lg object-contain cursor-pointer"
          onClick={handleImageClick}
          onError={(e) => {
            console.error("Image failed to load:", processedImageUrl, e);
          }}
        />
      </div>

      <ViewModal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={handleCloseModal}
      >
        <div className="flex justify-center">
          <Image
            src={processedImageUrl}
            alt={`${alt} - enlarged`}
            width={600}
            height={400}
            className="max-w-full max-h-full object-contain rounded-lg"
            onError={(e) => {
              console.error(
                "Image failed to load in modal:",
                processedImageUrl,
                e
              );
            }}
          />
        </div>
      </ViewModal>
    </>
  );
}
