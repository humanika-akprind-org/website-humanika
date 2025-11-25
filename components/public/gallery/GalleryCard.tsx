"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Gallery } from "@/types/gallery";

export default function GalleryCard({ gallery }: { gallery: Gallery }) {
  const [modalImageError] = useState(false);
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/drive-image?fileId=${gallery.image}`;
    link.download = `${gallery.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square bg-gray-200 rounded-md overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <h3 className="text-white font-medium text-sm">{gallery.title}</h3>
          </div>
          <Image
            src={`/api/drive-image?fileId=${gallery.image}`}
            alt={gallery.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              // Handle error client-side only
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const icon = document.createElement("div");
                icon.innerHTML =
                  '<svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                icon.className = "flex items-center justify-center h-full";
                parent.appendChild(icon);
              }
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gallery.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative w-full h-96 bg-gray-200 rounded-md overflow-hidden group">
            <Image
              src={`/api/drive-image?fileId=${gallery.image}`}
              alt={gallery.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Handle error client-side only
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const icon = document.createElement("div");
                  icon.innerHTML =
                    '<svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                  icon.className = "flex items-center justify-center h-full";
                  parent.appendChild(icon);
                }
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Event:</strong> {gallery.event?.name || "N/A"}
              </p>
            </div>
            <Button
              onClick={handleDownload}
              disabled={modalImageError}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
