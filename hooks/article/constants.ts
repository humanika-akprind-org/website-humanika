// Constants for article page
export const ARTICLES_PER_PAGE = 9;
export const CONTENT_TRUNCATE_LENGTH = 150;
export const LIST_CONTENT_TRUNCATE_LENGTH = 200;

export const SORT_OPTIONS = [
  { id: "newest" as const, label: "Terbaru", icon: "Clock" },
  { id: "popular" as const, label: "Populer", icon: "TrendingUp" },
  { id: "oldest" as const, label: "Terlama", icon: "BookOpen" },
] as const;

export const CATEGORY_COLORS = [
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
] as const;

export const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["id"];
export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
