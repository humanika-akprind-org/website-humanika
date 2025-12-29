import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";
import type { Article } from "@/types/article";
import {
  formatArticleDate,
  truncateContent,
} from "../../../../hooks/article/utils";

interface ArticleListProps {
  articles: Article[];
}

export const ArticleList = ({ articles }: ArticleListProps) => (
  <div className="space-y-6">
    {articles.map((article, index) => {
      const formattedDate = formatArticleDate(article.createdAt);
      const truncatedContent = truncateContent(article.content, 200);

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
                  width={320}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-grey-400">
                  <div className="w-12 h-12" />
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
                {truncatedContent}
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
);
