import React from "react";
import Link from "next/link";
import { User, Calendar, Eye, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import type { Article } from "types/article";
import { formatArticleDate } from "hooks/article/utils";

interface ArticleHeroSectionProps {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onShare: () => void;
}

export default function ArticleHeroSection({
  article,
  isBookmarked,
  onBookmarkToggle,
  onShare,
}: ArticleHeroSectionProps) {
  const formattedDate = formatArticleDate(article.createdAt);

  return (
    <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/article"
              className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Articles</span>
            </Link>
          </div>

          {/* Category */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium">
              {Array.isArray(article.category)
                ? article.category.map((c) => c.name).join(", ")
                : article.category?.name || "Artikel"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
              {article.title}
            </span>
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-primary-100/90 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            {article.viewCount && (
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{article.viewCount} views</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onBookmarkToggle}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                isBookmarked
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span>{isBookmarked ? "Disimpan" : "Simpan"}</span>
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
