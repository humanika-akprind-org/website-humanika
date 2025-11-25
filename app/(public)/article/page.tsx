"use client";

import ArticleCard from "@/components/public/article/ArticleCard";
import { useState, useEffect } from "react";
import type { Article } from "@/types/article";

interface ArticlePageType extends React.FC {
  fetchArticles?: () => void;
}

const ArticlePage: ArticlePageType = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize fetchArticles as static property
  ArticlePage.fetchArticles = ArticlePage.fetchArticles || (() => {});

  useEffect(() => {
    const fetchArticles = async () => {
      try {
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
    ArticlePage.fetchArticles = fetchArticles;

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Artikel HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Temukan artikel menarik seputar teknologi, karir, dan kegiatan
              mahasiswa informatika.
            </p>
          </div>
        </section>

        {/* Article List */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
              Artikel Terbaru
            </h2>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                <option>Semua Kategori</option>
                <option>Teknologi</option>
                <option>Event</option>
                <option>Karir</option>
                <option>Prestasi</option>
              </select>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                Urutkan
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat artikel...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
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
                  ArticlePage.fetchArticles?.();
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Muat Ulang
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
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

          {!loading && !error && articles.length > 0 && (
            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md">
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ArticlePage;
