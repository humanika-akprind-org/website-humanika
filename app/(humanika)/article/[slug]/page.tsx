"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useArticleDetail } from "@/src/presentation/hooks/article/useArticleDetail";
import { useBookmark } from "@/src/presentation/hooks/article/useBookmark";
import ArticleHeroSection from "@/src/presentation/components/public/sections/article/detail/ArticleHeroSection";
import ArticleContentSection from "@/src/presentation/components/public/sections/article/detail/ArticleContentSection";
import ArticleDetailLoadingState from "@/src/presentation/components/public/pages/article/ArticleDetailLoadingState";
import ArticleNotFoundState from "@/src/presentation/components/public/pages/article/ArticleNotFoundState";
import ArticleErrorState from "@/src/presentation/components/public/pages/article/ArticleErrorState";
import RelatedArticlesSection from "@/src/presentation/components/public/sections/article/RelatedArticlesSection";

export default function ArticleDetail() {
  const params = useParams();
  const slugParam = params.slug as string;

  const { article, relatedArticles, loading, error, refetch } =
    useArticleDetail(slugParam);
  const { isBookmarked, toggleBookmark } = useBookmark();

  if (loading) {
    return <ArticleDetailLoadingState />;
  }

  if (error) {
    return <ArticleErrorState error={error} onRetry={refetch} />;
  }

  if (!article) {
    return <ArticleNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <ArticleHeroSection
        article={article}
        isBookmarked={isBookmarked}
        onBookmarkToggle={toggleBookmark}
      />

      <ArticleContentSection article={article} />

      <RelatedArticlesSection relatedArticles={relatedArticles} />
    </div>
  );
}
