"use client";

import React, { useState, useEffect } from "react";
import { useArticleDetail } from "hooks/article/useArticleDetail";
import { useBookmark } from "hooks/article/useBookmark";
import { useShare } from "hooks/article/useShare";
import ArticleHeroSection from "components/public/article/ArticleHeroSection";
import ArticleContentSection from "components/public/article/ArticleContentSection";
import RelatedArticlesSection from "components/public/article/RelatedArticlesSection";
import LoadingState from "components/public/article/LoadingState";
import NotFoundState from "components/public/article/NotFoundState";
import ErrorState from "components/public/article/ErrorState";

export default function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  const { article, relatedArticles, loading, error } = useArticleDetail(id);
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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
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
