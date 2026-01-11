"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useArticleCategories } from "@/hooks/article-category/useArticleCategories";
import { useArticleData } from "@/hooks/article/useArticleData";
import { useArticleFilters } from "@/hooks/article/useArticleFilters";
import {
  createCategoryOptions,
  filterArticles,
  sortArticles,
} from "@/hooks/article/utils";
import { CATEGORY_COLORS, ARTICLES_PER_PAGE } from "@/hooks/article/constants";
import { HeroSection } from "@/components/public/sections/article/HeroSection";
import { ControlBar } from "@/components/public/pages/article/ControlBar";
import { ArticleGrid } from "@/components/public/pages/article/ArticleGrid";
import { ArticleList } from "@/components/public/pages/article/ArticleList";
import { LoadingState } from "@/components/public/pages/article/LoadingState";
import { ErrorState } from "@/components/public/pages/article/ErrorState";
import { EmptyState } from "@/components/public/pages/article/EmptyState";
import { PopularCategories } from "@/components/public/pages/article/PopularCategories";

interface ArticlePageType extends React.FC {
  fetchArticles?: () => void;
}

const ArticlePage: ArticlePageType = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // Data fetching
  const { articles, loading, error, fetchArticles } = useArticleData();

  // Categories
  const { categories: dynamicCategories } = useArticleCategories();

  // Filters and state
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    page,
    setPage,
    resetFilters,
  } = useArticleFilters(initialCategory);

  // Expose fetchArticles for manual reload button usage
  ArticlePage.fetchArticles = fetchArticles;

  // Create categories with colors
  const categories = useMemo(
    () =>
      createCategoryOptions(
        dynamicCategories,
        articles.length,
        CATEGORY_COLORS
      ),
    [dynamicCategories, articles.length]
  );

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    const filtered = filterArticles(articles, searchQuery, selectedCategory);
    const sorted = sortArticles(filtered, sortBy);
    return sorted.slice(0, page * ARTICLES_PER_PAGE);
  }, [articles, searchQuery, selectedCategory, sortBy, page]);

  // Check if more articles are available
  const hasMore = useMemo(() => {
    const filtered = filterArticles(articles, searchQuery, selectedCategory);
    return filtered.length > page * ARTICLES_PER_PAGE;
  }, [articles, searchQuery, selectedCategory, page]);

  // Load more handler
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Initial data fetch
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Loading state for initial load
  if (loading && page === 1) {
    return <LoadingState />;
  }

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCategory !== "all"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <HeroSection
        articles={articles}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dynamicCategories={dynamicCategories}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Control Bar */}
        <ControlBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchClear={() => setSearchQuery("")}
          onResetFilters={resetFilters}
        />

        {/* Article Content */}
        <div className="mt-12">
          {/* Error State */}
          {error && <ErrorState error={error} onRetry={fetchArticles} />}

          {/* Empty State */}
          {!loading && !error && filteredAndSortedArticles.length === 0 && (
            <EmptyState
              hasFilters={hasActiveFilters}
              onResetFilters={resetFilters}
            />
          )}

          {/* Articles Display */}
          {filteredAndSortedArticles.length > 0 && (
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
                    Menampilkan {filteredAndSortedArticles.length} dari{" "}
                    {articles.length} artikel
                  </p>
                </div>
                <div className="text-sm text-grey-600">
                  Halaman {page} •{" "}
                  {Math.ceil(articles.length / ARTICLES_PER_PAGE)} total halaman
                </div>
              </div>

              {/* Articles */}
              {viewMode === "grid" ? (
                <ArticleGrid articles={filteredAndSortedArticles} />
              ) : (
                <ArticleList articles={filteredAndSortedArticles} />
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
                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Memuat...
                      </>
                    ) : (
                      <>
                        <span>Muat Lebih Banyak</span>
                        <div className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-grey-600 text-sm mt-4">
                    Menampilkan {filteredAndSortedArticles.length} dari{" "}
                    {articles.length} artikel
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Popular Categories */}
        <PopularCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={setSelectedCategory}
        />
      </div>
    </div>
  );
};

export default ArticlePage;
