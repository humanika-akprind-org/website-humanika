import { FiTag, FiFileText } from "react-icons/fi";
import type { GalleryCategory } from "@/types/gallery-category";
import StatCard from "../../../ui/card/StatCard";

interface GalleryCategoryStatsProps {
  categories: GalleryCategory[];
}

export default function GalleryCategoryStats({
  categories,
}: GalleryCategoryStatsProps) {
  const totalCategories = categories.length;
  const categoriesWithDescription = categories.filter(
    (category) => category.description && category.description.trim() !== ""
  ).length;

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      icon: FiTag,
      color: "blue",
    },
    {
      title: "With Description",
      value: categoriesWithDescription,
      icon: FiFileText,
      color: "green",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
