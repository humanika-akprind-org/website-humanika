import React from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";

interface GalleryDetailAlbumDescriptionProps {
  description: string;
}

export default function GalleryDetailAlbumDescription({
  description,
}: GalleryDetailAlbumDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-grey-200">
        <h3 className="text-xl font-bold text-grey-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Film className="w-6 h-6 text-primary-600" />
          </div>
          Deskripsi Album
        </h3>
        <div className="prose prose-lg max-w-none">
          <HtmlRenderer html={description} />
        </div>
      </div>
    </motion.div>
  );
}
