"use client";

import React from "react";
import { Share2, Bookmark } from "lucide-react";
import ShareButtons from "./ShareButtons";
import type { Article } from "types/article";

interface ActionBarProps {
  article: Article;
}

export default function ActionBar({ article }: ActionBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-grey-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-grey-700 font-medium">Share artikel:</span>
          <ShareButtons article={article} />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
            <Bookmark className="w-4 h-4" />
            <span>Simpan Artikel</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.title,
                  text: `Baca artikel: ${article.title}`,
                  url:
                    typeof window !== "undefined" ? window.location.href : "",
                });
              } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert("Link berhasil disalin!");
              }
            }}
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
