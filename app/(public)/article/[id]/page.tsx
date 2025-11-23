"use client";

import React, { useState, useEffect } from "react";
import { getArticle } from "use-cases/api/article";
import type { Article } from "types/article";
import Image from "next/image";
import ArticleCard from "components/public/article/ArticleCard";

// Helper function to get preview URL from image (file ID or URL)
function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (image.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `https://drive.google.com/uc?export=view&id=${image}`;
  } else {
    // It's a direct URL or other format
    return image;
  }
}

export default function ArticleDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        const articleData = await getArticle(id);
        setArticle(articleData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  if (loading) return <div>Loading article details...</div>;
  if (error) return <div>Error loading article: {error}</div>;
  if (!article) return <div>No article found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Article Header */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-3">
              {Array.isArray(article.category)
                ? article.category.map((c) => c.name).join(", ")
                : article.category?.name || ""}
            </span>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {article.title}
          </h1>

          <div className="flex items-center mb-8">
            <div className="bg-gray-200 w-10 h-10 rounded-full mr-3 overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.author.role}</p>
            </div>
          </div>

          {article.thumbnail ? (
            <div className="bg-white-0 rounded-xl mb-8 flex items-center justify-center w-full h-96 overflow-hidden relative">
              <Image
                src={getPreviewUrl(article.thumbnail)}
                alt={article.title}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-xl"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl mb-8 flex flex-col items-center justify-center w-full h-96 text-grey-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-lg font-medium">No image available</p>
            </div>
          )}
        </section>

        {/* Article Content */}
        <section className="max-w-2xl mx-auto prose prose-blue prose-lg mb-16">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </section>

        {/* Related Articles */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
            Artikel Terkait
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(article as any)?.relatedArticles &&
            (article as any).relatedArticles.length > 0
              ? (article as any).relatedArticles.map((item: any) => (
                  <ArticleCard key={item.id} article={item} />
                ))
              : null}
          </div>
        </section>
      </main>
    </div>
  );
}
