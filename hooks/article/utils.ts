import type { Article } from "@/types/article";
import type { SortOption } from "./constants";
import { type ArticleCategory } from "@/types/article-category";

/**
 * Filters articles based on search query and category
 */
export const filterArticles = (
  articles: Article[],
  searchQuery: string,
  selectedCategory: string
): Article[] => {
  let filtered = [...articles];

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query) ||
        article.author?.name?.toLowerCase().includes(query)
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

  return filtered;
};

/**
 * Sorts articles based on the selected sort option
 */
export const sortArticles = (
  articles: Article[],
  sortBy: SortOption
): Article[] => {
  const sorted = [...articles];

  sorted.sort((a, b) => {
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
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });

  return sorted;
};

/**
 * Formats date for display
 */
export const formatArticleDate = (date: Date | string | undefined): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Truncates content for display
 */
export const truncateContent = (
  content: string | undefined,
  maxLength: number
): string => {
  if (!content) return "";
  const cleanContent = content.replace(/<[^>]*>/g, "");
  return cleanContent.length > maxLength
    ? `${cleanContent.substring(0, maxLength)}...`
    : cleanContent;
};

/**
 * Gets unique author count from articles
 */
export const getUniqueAuthorCount = (articles: Article[]): number =>
  new Set(articles.map((article) => article.author?.id)).size;

/**
 * Creates category options with colors
 */
export const createCategoryOptions = (
  dynamicCategories: ArticleCategory[],
  articleCount: number,
  colors: readonly string[]
) => {
  const allCategory = {
    id: "all",
    name: "Semua Kategori",
    count: articleCount,
    color: "from-grey-500 to-grey-600",
  };

  const dynamicCategoryOptions = dynamicCategories.map((category, index) => ({
    id: category.name.toLowerCase().replace(/\s+/g, "-"),
    name: category.name,
    count: category._count?.articles || 0,
    color: colors[index % colors.length],
  }));

  return [allCategory, ...dynamicCategoryOptions];
};
