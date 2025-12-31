import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import ActionBar from "@/components/public/article/ActionBar";
import type { Article } from "types/article";
import { getPreviewUrl } from "lib/utils";

interface ArticleContentSectionProps {
  article: Article;
}

export default function ArticleContentSection({
  article,
}: ArticleContentSectionProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto">
        {/* Thumbnail Image */}
        <div className="mb-12">
          <div className="relative max-w-4xl mx-auto w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-50 to-primary-100">
            {getPreviewUrl(article.thumbnail) ? (
              <>
                <Image
                  src={getPreviewUrl(article.thumbnail)}
                  alt={article.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-200">
                <FileText className="w-32 h-32 mb-4" />
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-grey-200">
            <HtmlRenderer html={article.content} />
          </div>
        </article>

        {/* Action Bar */}
        <ActionBar article={article} />
      </div>
    </div>
  );
}
