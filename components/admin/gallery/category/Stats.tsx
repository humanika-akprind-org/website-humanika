import { FiTag, FiFileText, FiClock } from "react-icons/fi";
import type { GalleryCategory } from "@/types/gallery-category";

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

  const recentCategories = categories.filter((category) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(category.createdAt) >= thirtyDaysAgo;
  }).length;

  const stats = [
    {
      name: "Total Categories",
      value: totalCategories,
      icon: FiTag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "With Description",
      value: categoriesWithDescription,
      icon: FiFileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Recent (30 days)",
      value: recentCategories,
      icon: FiClock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
