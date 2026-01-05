import { FiFolder, FiFileText } from "react-icons/fi";
import type { ArticleCategory } from "@/types/article-category";
import StatCard from "../../../ui/card/StatCard";

interface ArticleCategoryStatsProps {
  categories: ArticleCategory[];
}

export default function ArticleCategoryStats({
  categories,
}: ArticleCategoryStatsProps) {
  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: FiFolder,
      color: "blue",
    },
    {
      title: "With Description",
      value: categories.filter((category) => category.description).length,
      icon: FiFileText,
      color: "green",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
