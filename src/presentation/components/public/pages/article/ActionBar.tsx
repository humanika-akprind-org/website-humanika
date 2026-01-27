"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import ShareButton from "@/presentation/components/public/ui/ShareButton";
import type { Article } from "@/domain/entities/article.entity";

interface ActionBarProps {
  article: Article;
}

export default function ActionBar({ article }: ActionBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-grey-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-grey-700 font-medium">Bagikan artikel:</span>
          <ShareButton title={article.title} />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
            <Bookmark className="w-4 h-4" />
            <span>Simpan Artikel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
