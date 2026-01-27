import { motion } from "framer-motion";
import { Grid3x3, Sparkles, TrendingUp } from "lucide-react";
import type { Album } from "@/presentation/lib/gallery-utils";
import type { Gallery } from "@/domain/entities/gallery";
import { GALLERY_TAB_CONFIGS, ANIMATION_DELAYS } from "./constants";

interface GalleryTabsProps {
  activeTab: "albums" | "highlights" | "trending";
  onTabChange: (tab: "albums" | "highlights" | "trending") => void;
  albums: Album[];
  galleries: Gallery[];
}

export default function GalleryTabs({
  activeTab,
  onTabChange,
  albums,
  galleries,
}: GalleryTabsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Grid3x3":
        return Grid3x3;
      case "Sparkles":
        return Sparkles;
      case "TrendingUp":
        return TrendingUp;
      default:
        return Grid3x3;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAYS.tabs }}
      className="mb-8 flex justify-center"
    >
      <div className="inline-flex rounded-xl bg-grey-100 p-1.5 md:p-2 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {GALLERY_TAB_CONFIGS.map((tab) => {
          const IconComponent = getIcon(tab.iconName);
          const count =
            tab.id === "albums"
              ? (tab.getCount as (data: Album[]) => number)(albums)
              : (tab.getCount as (data: Gallery[]) => number)(galleries);

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                  : "text-grey-700 hover:text-primary-600 hover:bg-white"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">
                {tab.id === "albums" && "Album"}
                {tab.id === "highlights" && "Highlight"}
                {tab.id === "trending" && "Trending"}
              </span>
              <span
                className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full ${
                  activeTab === tab.id ? "bg-white/30" : "bg-grey-200"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
