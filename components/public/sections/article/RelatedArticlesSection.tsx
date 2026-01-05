import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/public/pages/card/article/ArticleCard";
import type { Article } from "types/article";

interface RelatedArticlesSectionProps {
  relatedArticles: Article[];
}

export default function RelatedArticlesSection({
  relatedArticles,
}: RelatedArticlesSectionProps) {
  if (relatedArticles.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-grey-50/50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-grey-900 mb-2">
                Artikel Terkait
              </h2>
              <p className="text-grey-600 text-lg">
                Temukan artikel menarik lainnya yang mungkin Anda suka
              </p>
            </div>
            <Link
              href="/article"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <span>Lihat Semua</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          {/* Mobile "View All" Button */}
          <div className="md:hidden mt-6">
            <Link
              href="/article"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <span>Lihat Semua Artikel</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {relatedArticles.slice(0, 6).map((item, index) => {
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "";
              const truncatedContent =
                item.content && item.content.length > 150
                  ? `${item.content.substring(0, 150)}...`
                  : item.content || "";

              return (
                <div
                  key={item.id}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <ArticleCard
                    article={{
                      ...item,
                    }}
                    formattedDate={formattedDate}
                    truncatedContent={truncatedContent}
                    index={index}
                  />
                </div>
              );
            })}
          </div>

          {/* Show more articles hint */}
          {relatedArticles.length > 6 && (
            <div className="text-center mt-12">
              <p className="text-grey-600 mb-4">
                Masih ada {relatedArticles.length - 6} artikel terkait lainnya
              </p>
              <Link
                href="/article"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                <span>Jelajahi Semua Artikel</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
