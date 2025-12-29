"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ArticleCard from "../article/ArticleCard";
import type { Article } from "@/types/article";
import { motion } from "framer-motion";
import {
  Newspaper,
  RefreshCw,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface ArticleSectionType extends React.FC {
  fetchArticles?: () => void;
}

const ArticleSection: ArticleSectionType = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Initialize fetchArticles as static property
  ArticleSection.fetchArticles = ArticleSection.fetchArticles || (() => {});

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  // Expose fetchArticles for manual reload button usage
  ArticleSection.fetchArticles = fetchArticles;

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-grey-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            INFORMASI TERBARU
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Artikel & Insight
            </span>
            <br />
            Seputar Teknologi
          </h2>

          <p className="text-lg text-grey-600 max-w-2xl mx-auto leading-relaxed">
            Temukan wawasan, tutorial, dan perspektif terbaru seputar dunia
            informatika dan teknologi dari para ahli kami.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && !refreshing && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              <p className="text-grey-600 font-medium">
                Memuat artikel terbaru...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto bg-red-50 p-8 rounded-2xl border border-red-100">
              <AlertCircle className="w-16 h-16 text-red-500" />
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-2">
                  Gagal Memuat Artikel
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
              </div>
              <button
                onClick={fetchArticles}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat Ulang...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Coba Lagi
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <Newspaper className="w-12 h-12 text-primary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-grey-900 mb-2">
                  Belum Ada Artikel
                </h3>
                <p className="text-grey-600 mb-8">
                  Saat ini belum ada artikel yang tersedia. Silakan kembali lagi
                  nanti.
                </p>
              </div>
              <button
                onClick={fetchArticles}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Muat Ulang
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <>
            <div className="relative mb-16">
              {/* Refresh Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={fetchArticles}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Perbarui Artikel
                    </>
                  )}
                </button>
              </div>

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(0, 6).map((article: Article, index: number) => {
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
                      index={index}
                    />
                  );
                })}
              </div>

              {/* Gradient Fade Out */}
              {articles.length > 6 && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
              )}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Link
                href="/article"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                <span>Jelajahi Semua Artikel</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-grey-600 text-sm mt-4">
                {articles.length}+ artikel tersedia untuk Anda
              </p>
            </motion.div>
          </>
        )}

        {/* Featured Categories */}
        {!loading && !error && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-12 border-t border-grey-200"
          >
            <h3 className="text-2xl font-bold text-grey-900 mb-8 text-center">
              Kategori Populer
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Teknologi", count: 12 },
                { name: "Pemrograman", count: 8 },
                { name: "AI/ML", count: 5 },
                { name: "Web Development", count: 15 },
                { name: "Tips & Trik", count: 7 },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/article?category=${category.name}`}
                  className="group flex items-center gap-3 px-6 py-3 bg-white border border-grey-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                >
                  <span className="font-medium text-grey-800 group-hover:text-primary-700">
                    {category.name}
                  </span>
                  <span className="bg-grey-100 text-grey-600 text-xs px-2 py-1 rounded-full group-hover:bg-primary-100 group-hover:text-primary-700">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ArticleSection;
