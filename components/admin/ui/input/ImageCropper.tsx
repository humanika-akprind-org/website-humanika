"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedImageUrl: string) => void;
  aspect?: number; // default 16/9
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspect = 16 / 9,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  // Function to handle crop completion
  const onCropCompleteHandler = (
    _croppedArea: CroppedAreaPixels,
    croppedAreaPixels: CroppedAreaPixels
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Function to create cropped image
  const createCroppedImage = async (
    imageSrc: string,
    cropArea: CroppedAreaPixels
  ): Promise<string> =>
    new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = document.createElement("img");

      image.onload = () => {
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx?.drawImage(
          image,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve(croppedImageUrl);
          }
        }, "image/jpeg");
      };

      image.src = imageSrc;
    });

  const handleApplyCrop = async () => {
    if (croppedAreaPixels && imageSrc) {
      const croppedImg = await createCroppedImage(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImg);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 max-w-2xl w-full mx-4">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">
                Crop Image ({aspect === 16 / 9 ? "16:9" : "Custom"})
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>

            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropCompleteHandler}
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleApplyCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImageCropper;
