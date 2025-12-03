"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ArticleCard from "./article/ArticleCard";
import type { Article } from "@/types/article";

interface ArticleSectionType extends React.FC {
  fetchArticles?: () => void;
}

const ArticleSection: ArticleSectionType = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize fetchArticles as static property
  ArticleSection.fetchArticles = ArticleSection.fetchArticles || (() => {});

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/article?isPublished=true");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.warn("Unexpected data format from articles API:", data);
          setArticles([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    // Expose fetchArticles for manual reload button usage
    ArticleSection.fetchArticles = fetchArticles;

    fetchArticles();
  }, []);

  return (
    <section className="py-16 bg-grey-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 text-grey-900 mb-4">Artikel Terbaru</h2>
          <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
            Temukan wawasan dan perspektif terbaru seputar teknologi dan
            informatika
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat artikel...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                setArticles([]);
                ArticleSection.fetchArticles?.();
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada artikel ditemukan.</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                setArticles([]);
                ArticleSection.fetchArticles?.();
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article: Article) => {
                const formattedDate = article.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "";
                const truncatedContent =
                  article.content && article.content.length > 150
                    ? `${article.content.substring(0, 150)}...`
                    : article.content || "";
                return (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    formattedDate={formattedDate}
                    truncatedContent={truncatedContent}
                  />
                );
              })}
            </div>

            <div className="text-center">
              <Link
                href="/article"
                className="inline-flex items-center px-6 py-3 bg-white border border-grey-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Lihat Semua Artikel
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ArticleSection;
