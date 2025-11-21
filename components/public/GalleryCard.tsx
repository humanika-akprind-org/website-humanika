import React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Gallery } from "@/types/gallery";

export default function GalleryCard({ gallery }: { gallery: Gallery }) {
  const [imageError, setImageError] = useState(false);
  const [modalImageError, setModalImageError] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square bg-gray-200 rounded-md overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <h3 className="text-white font-medium text-sm">{gallery.title}</h3>
          </div>
          {imageError ? (
            <div className="flex items-center justify-center h-full z-10">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          ) : (
            <>
              <Image
                src={`/api/drive-image?fileId=${gallery.image}`}
                alt={gallery.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <h3 className="text-white font-medium text-sm">
                  {gallery.title}
                </h3>
              </div>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gallery.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative w-full h-96 bg-gray-200 rounded-md overflow-hidden group">
            {modalImageError ? (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            ) : (
              <Image
                src={`/api/drive-image?fileId=${gallery.image}`}
                alt={gallery.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                onError={() => setModalImageError(true)}
              />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Event:</strong> {gallery.event?.name || "N/A"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
