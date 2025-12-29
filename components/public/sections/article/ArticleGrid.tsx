import { AnimatePresence } from "framer-motion";
import ArticleCard from "@/components/public/article/ArticleCard";
import type { Article } from "@/types/article";
import {
  formatArticleDate,
  truncateContent,
} from "../../../../hooks/article/utils";

interface ArticleGridProps {
  articles: Article[];
}

export const ArticleGrid = ({ articles }: ArticleGridProps) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    <AnimatePresence>
      {articles.map((article, index) => {
        const formattedDate = formatArticleDate(article.createdAt);
        const truncatedContent = truncateContent(article.content, 150);

        return (
          <ArticleCard
            key={article.id}
            article={article}
            formattedDate={formattedDate}
            truncatedContent={truncatedContent}
            index={index}
          />
        );
      })}
    </AnimatePresence>
  </div>
);
