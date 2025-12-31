import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/public/card/article/ArticleCard";
import type { Article } from "types/article";

interface RelatedArticlesSectionProps {
  relatedArticles: Article[];
}

export default function RelatedArticlesSection({
  relatedArticles,
}: RelatedArticlesSectionProps) {
  if (relatedArticles.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-grey-900">Artikel Terkait</h2>
        <Link
          href="/article"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
        >
          <span>Lihat Semua</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((item) => {
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
            <ArticleCard
              key={item.id}
              article={{
                ...item,
              }}
              formattedDate={formattedDate}
              truncatedContent={truncatedContent}
            />
          );
        })}
      </div>
    </section>
  );
}
