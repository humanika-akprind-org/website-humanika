"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useArticleDetail } from "hooks/article/useArticleDetail";
import { useBookmark } from "hooks/article/useBookmark";
import { useShare } from "hooks/article/useShare";
import ArticleHeroSection from "@/components/public/sections/article/detail/ArticleHeroSection";
import ArticleContentSection from "@/components/public/sections/article/detail/ArticleContentSection";
import RelatedArticlesSection from "@/components/public/sections/article/RelatedArticlesSection";
import ArticleDetailLoadingState from "@/components/public/pages/article/ArticleDetailLoadingState";
import NotFoundState from "@/components/public/pages/article/NotFoundState";
import { ErrorState } from "@/components/public/pages/article/ErrorState";

export default function ArticleDetail() {
  const params = useParams();
  const slugParam = params.slug as string;

  const { article, relatedArticles, loading, error, refetch } =
    useArticleDetail(slugParam);
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { handleShare } = useShare();

  const onShare = () => {
    if (article) {
      handleShare(
        article.title,
        article.content?.substring(0, 100) + "...",
        window.location.href
      );
    }
  };

  if (loading) {
    return <ArticleDetailLoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!article) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <ArticleHeroSection
        article={article}
        isBookmarked={isBookmarked}
        onBookmarkToggle={toggleBookmark}
        onShare={onShare}
      />

      <ArticleContentSection article={article} />

      <RelatedArticlesSection relatedArticles={relatedArticles} />
    </div>
  );
}
