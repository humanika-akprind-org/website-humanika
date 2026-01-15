import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface PopularCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryClick?: (categoryId: string) => void;
}

export const PopularCategories = ({
  categories,
  selectedCategory,
  onCategoryClick,
}: PopularCategoriesProps) => {
  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
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
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
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
          </button>
        ))}
      </div>
    </motion.div>
  );
};
