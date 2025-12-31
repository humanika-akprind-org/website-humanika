import type { Album } from "@/lib/gallery-utils";
import type { Gallery } from "@/types/gallery";

export const GALLERY_TAB_CONFIGS = [
  {
    id: "albums" as const,
    label: "Album",
    iconName: "Grid3x3",
    getCount: (albums: Album[]) => albums.length,
  },
  {
    id: "highlights" as const,
    label: "Highlight",
    iconName: "Sparkles",
    getCount: (galleries: Gallery[]) => Math.min(12, galleries.length),
  },
  {
    id: "trending" as const,
    label: "Trending",
    iconName: "TrendingUp",
    getCount: (galleries: Gallery[]) => Math.min(8, galleries.length),
  },
];

export const SORT_OPTIONS = [
  {
    id: "recent" as const,
    label: "Terbaru",
    iconName: "Calendar",
  },
  {
    id: "popular" as const,
    label: "Paling Populer",
    iconName: "Heart",
  },
  {
    id: "event" as const,
    label: "Berdasarkan Event",
    iconName: "Users",
  },
];

export const VIEW_MODE_OPTIONS = [
  { value: "both" as const, label: "Album & Foto" },
  { value: "albums" as const, label: "Album Saja" },
  { value: "photos" as const, label: "Foto Saja" },
];

export const DEFAULT_FILTERS = {
  searchQuery: "",
  selectedYear: "all" as string,
  selectedEvent: "all" as string,
  viewMode: "both" as "albums" | "photos" | "both",
  activeTab: "albums" as "albums" | "highlights" | "trending",
  sortBy: "recent" as "recent" | "popular" | "event",
};

export const ANIMATION_DELAYS = {
  heroStats: 0.2,
  tabs: 0.1,
  controlBar: 0.2,
  content: 0.3,
  albumsSection: 0.3,
  photosSection: 0.4,
  topEventsSection: 0.6,
};
