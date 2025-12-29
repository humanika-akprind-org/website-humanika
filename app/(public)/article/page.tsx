"use client";

import ArticleCard from "@/components/public/article/ArticleCard";
import { useState, useEffect } from "react";
import type { Article } from "@/types/article";
import { useArticleCategories } from "@/hooks/article-category/useArticleCategories";
import {
  Newspaper,
  Filter,
  SortAsc,
  Search,
  TrendingUp,
  Clock,
  Tag,
  ChevronDown,
  Loader2,
  RefreshCw,
  X,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface ArticlePageType extends React.FC {
  fetchArticles?: () => void;
}

const ArticlePage: ArticlePageType = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "oldest">(
    "newest"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // Initialize fetchArticles as static property
  ArticlePage.fetchArticles = ArticlePage.fetchArticles || (() => {});

  // Fetch dynamic categories from API
  const { categories: dynamicCategories } = useArticleCategories();

  // Dynamic categories from API
  const categories = [
    {
      id: "all",
      name: "Semua Kategori",
      count: articles.length,
      color: "from-grey-500 to-grey-600",
    },
    ...dynamicCategories.map((category, index) => {
      const colors = [
        "from-blue-500 to-blue-600",
        "from-purple-500 to-purple-600",
        "from-pink-500 to-pink-600",
        "from-green-500 to-green-600",
        "from-orange-500 to-orange-600",
        "from-cyan-500 to-cyan-600",
        "from-red-500 to-red-600",
        "from-yellow-500 to-yellow-600",
        "from-indigo-500 to-indigo-600",
        "from-teal-500 to-teal-600",
      ];
      return {
        id: category.name.toLowerCase().replace(/\s+/g, "-"),
        name: category.name,
        count: category._count?.articles || 0,
        color: colors[index % colors.length],
      };
    }),
  ];

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = [...articles];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) =>
          article.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
          selectedCategory.toLowerCase()
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "popular":
          // Assuming you have a viewCount field
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered.slice(0, page * 9));
    setHasMore(filtered.length > page * 9);
  }, [articles, searchQuery, selectedCategory, sortBy, page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/article?status=PUBLISH");
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

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
              <Newspaper className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-grey-600 font-medium">Memuat artikel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Newspaper className="w-4 h-4" />
              <span className="text-sm font-medium">PUSTAKA DIGITAL</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Artikel & Insight
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
                HUMANIKA
              </span>
            </h1>

            <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Temukan wawasan terkini seputar teknologi, pemrograman, karir, dan
              perkembangan dunia informatika dari para ahli dan praktisi.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari artikel berdasarkan judul, konten, atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 placeholder-primary-200"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-200 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {articles.length} Artikel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {new Set(articles.map((a) => a.author?.id)).size} Penulis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {dynamicCategories.length} Kategori
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-grey-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Filters */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-grey-600" />
                    <span className="text-sm font-medium text-grey-700">
                      Filter:
                    </span>
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                            : "bg-grey-100 text-grey-700 hover:bg-grey-200"
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {category.name}
                        {category.id !== "all" && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              selectedCategory === category.id
                                ? "bg-white/30"
                                : "bg-grey-300"
                            }`}
                          >
                            {category.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Sort By */}
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-grey-100 text-grey-700 rounded-lg hover:bg-grey-200 transition-colors text-sm font-medium">
                    <SortAsc className="w-4 h-4" />
                    {sortBy === "newest"
                      ? "Terbaru"
                      : sortBy === "popular"
                      ? "Populer"
                      : "Terlama"}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-grey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {[
                      {
                        id: "newest" as const,
                        label: "Terbaru",
                        icon: <Clock className="w-4 h-4" />,
                      },
                      {
                        id: "popular" as const,
                        label: "Populer",
                        icon: <TrendingUp className="w-4 h-4" />,
                      },
                      {
                        id: "oldest" as const,
                        label: "Terlama",
                        icon: <BookOpen className="w-4 h-4" />,
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          sortBy === option.id
                            ? "bg-primary-50 text-primary-600"
                            : "text-grey-700 hover:bg-grey-50"
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-grey-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-grey-600 hover:text-primary-600"
                    }`}
                    aria-label="Grid view"
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-current rounded-sm" />
                      ))}
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-grey-600 hover:text-primary-600"
                    }`}
                    aria-label="List view"
                  >
                    <div className="w-4 h-4 flex flex-col gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-full h-1 bg-current rounded-full"
                        />
                      ))}
                    </div>
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => {
                    setPage(1);
                    fetchArticles();
                  }}
                  className="p-2 text-grey-600 hover:text-primary-600 transition-colors"
                  aria-label="Refresh articles"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all") && (
              <div className="mt-6 pt-6 border-t border-grey-200">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-grey-600">Filter aktif:</span>
                  {searchQuery && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>&quot;{searchQuery}&quot;</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedCategory !== "all" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>
                        Kategori:{" "}
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.name
                        }
                      </span>
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {(searchQuery || selectedCategory !== "all") && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-grey-600 hover:text-primary-600 transition-colors"
                    >
                      Reset semua filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-grey-900 mb-2">
                    Gagal Memuat Artikel
                  </h3>
                  <p className="text-grey-600 mb-6">{error}</p>
                </div>
                <button
                  onClick={fetchArticles}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-grey-900 mb-2">
                    Tidak Ada Artikel Ditemukan
                  </h3>
                  <p className="text-grey-600 mb-8">
                    {searchQuery || selectedCategory !== "all"
                      ? "Coba ubah filter atau kata kunci pencarian Anda."
                      : "Belum ada artikel yang tersedia saat ini."}
                  </p>
                </div>
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Articles Grid/List */}
          {filteredArticles.length > 0 && (
            <>
              {/* Results Info */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-grey-900">
                    {searchQuery
                      ? `Hasil pencarian "${searchQuery}"`
                      : "Artikel Terbaru"}
                  </h2>
                  <p className="text-grey-600 mt-2">
                    Menampilkan {filteredArticles.length} dari {articles.length}{" "}
                    artikel
                  </p>
                </div>
                <div className="text-sm text-grey-600">
                  Halaman {page} • {Math.ceil(articles.length / 9)} total
                  halaman
                </div>
              </div>

              {/* Articles Display */}
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredArticles.map((article, index) => {
                      const formattedDate = article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
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
                  </AnimatePresence>
                </div>
              ) : (
                // List View
                <div className="space-y-6">
                  {filteredArticles.map((article, index) => {
                    const formattedDate = article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "";
                    return (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-grey-200 overflow-hidden"
                      >
                        <Link
                          href={`/article/${article.id}`}
                          className="flex flex-col md:flex-row"
                        >
                          {/* Thumbnail */}
                          <div className="md:w-64 lg:w-80 h-48 md:h-auto bg-grey-100 relative overflow-hidden">
                            {article.thumbnail ? (
                              <Image
                                src={article.thumbnail}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-grey-400">
                                <Newspaper className="w-12 h-12" />
                              </div>
                            )}
                            {/* Category Badge */}
                            {article.category?.name && (
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                                {article.category.name}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-4 text-sm text-grey-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formattedDate}
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {article.category?.name || "Umum"}
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-grey-900 mb-3 group-hover:text-primary-600 transition-colors">
                              {article.title}
                            </h3>

                            <p className="text-grey-600 mb-4 line-clamp-2">
                              {article.content
                                ?.replace(/<[^>]*>/g, "")
                                .substring(0, 200)}
                              ...
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary-600">
                                      {article.author?.name?.charAt(0) || "?"}
                                    </span>
                                  </div>
                                  <span className="text-sm text-grey-700">
                                    {article.author?.name || "Anonim"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                                Baca selengkapnya →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memuat...
                      </>
                    ) : (
                      <>
                        <span>Muat Lebih Banyak</span>
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-grey-600 text-sm mt-4">
                    Menampilkan {filteredArticles.length} dari {articles.length}{" "}
                    artikel
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-grey-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                Jelajahi Kategori
              </span>
            </h2>
            <p className="text-grey-600 max-w-2xl mx-auto">
              Temukan artikel berdasarkan topik yang paling diminati
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/article?category=${category.id}`}
                className={`group flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-br ${category.color} text-white shadow-lg scale-105`
                    : "bg-white text-grey-700 hover:bg-grey-50 shadow-md hover:shadow-lg"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-grey-100 group-hover:bg-primary-50"
                  }`}
                >
                  <Tag
                    className={`w-6 h-6 ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-grey-600 group-hover:text-primary-600"
                    }`}
                  />
                </div>
                <span className="font-semibold text-center text-sm">
                  {category.name}
                </span>
                <span
                  className={`text-xs mt-2 ${
                    selectedCategory === category.id
                      ? "text-white/80"
                      : "text-grey-500"
                  }`}
                >
                  {category.count} artikel
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticlePage;
