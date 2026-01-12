"use client";

import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import { Calendar, ArrowRight, Clock, Tag, FileText } from "lucide-react";
import { motion } from "framer-motion";

// Helper function to get preview URL from image (file ID or URL)
function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (image.includes("drive.google.com")) {
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${image}`;
  } else {
    return image;
  }
}

// Helper to calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Category color mapping
const categoryColors: Record<string, string> = {
  Teknologi: "from-blue-500 to-blue-600",
  Pemrograman: "from-purple-500 to-purple-600",
  "AI/ML": "from-pink-500 to-pink-600",
  "Web Development": "from-green-500 to-green-600",
  "Mobile Dev": "from-orange-500 to-orange-600",
  "Data Science": "from-red-500 to-red-600",
  "Tips & Trik": "from-cyan-500 to-cyan-600",
  Berita: "from-indigo-500 to-indigo-600",
  default: "from-primary-600 to-primary-700",
};

interface ArticleCardProps {
  article: Article;
  formattedDate: string;
  truncatedContent: string;
  index?: number;
}

export default function ArticleCard({
  article,
  formattedDate,
  truncatedContent,
  index = 0,
}: ArticleCardProps) {
  const categoryColor =
    categoryColors[article.category?.name || ""] || categoryColors.default;
  const readingTime = calculateReadingTime(article.content || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-grey-200"
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryColor} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}
        >
          <Tag className="w-3 h-3" />
          {article.category?.name || "Artikel"}
        </div>
      </div>

      {/* Article Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        {article.thumbnail ? (
          <Image
            src={getPreviewUrl(article.thumbnail)}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-500"
            priority={index < 3}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-24 h-24 text-primary-200" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Read Time Badge */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
          <Clock className="w-3 h-3 inline mr-1" />
          {readingTime}
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-grey-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate || "Loading date..."}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-grey-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {article.title}
        </h3>

        {/* Content Preview */}
        <div className="mb-6">
          <HtmlRenderer
            html={truncatedContent}
            className="text-grey-700 line-clamp-3 leading-relaxed"
          />
        </div>

        {/* Author & Read Button */}
        <div className="flex items-center justify-end pt-4 border-t border-grey-100">
          <Link
            href={`/article/${article.slug}`}
            className="group/link inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all duration-300 font-semibold"
          >
            <span>Baca</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-200 rounded-2xl pointer-events-none transition-all duration-300" />
    </motion.div>
  );
}
