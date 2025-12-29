"use client";

import React, { useState, useEffect } from "react";
import { getArticle } from "use-cases/api/article";
import type { Article } from "types/article";
import Image from "next/image";
import ArticleCard from "components/public/article/ArticleCard";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import {
  FileText,
  Calendar,
  User,
  ArrowLeft,
  Eye,
  Bookmark,
  Share2,
} from "lucide-react";
import Link from "next/link";
import ActionBar from "@/components/public/article/ActionBar";

// Helper function to get preview URL from image (file ID or URL)
function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (image.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `/api/drive-image?fileId=${image}`;
  } else {
    // It's a direct URL or other format
    return image;
  }
}

export default function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;

      try {
        setLoading(true);
        const articleData = await getArticle(id);
        setArticle(articleData);

        // Use related articles from the API response
        setRelatedArticles(articleData.relatedArticles || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-grey-600">Loading article details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Error loading article
          </h1>
          <p className="text-grey-600">{error}</p>
          <Link
            href="/article"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-grey-400 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Article Not Found
          </h1>
          <p className="text-grey-600">
            The requested article could not be found.
          </p>
          <Link
            href="/article"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Articles
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Article Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <Link
                href="/article"
                className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Articles</span>
              </Link>
            </div>

            {/* Category */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium">
                {Array.isArray(article.category)
                  ? article.category.map((c) => c.name).join(", ")
                  : article.category?.name || "Artikel"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                {article.title}
              </span>
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-primary-100/90 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              {article.viewCount && (
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{article.viewCount} views</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isBookmarked
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
                <span>{isBookmarked ? "Disimpan" : "Simpan"}</span>
              </button>

              <button
                onClick={() => {
                  navigator
                    .share?.({
                      title: article.title,
                      text: article.content?.substring(0, 100) + "...",
                      url: window.location.href,
                    })
                    .catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto">
          {/* Thumbnail Image */}
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-50 to-primary-100">
              {getPreviewUrl(article.thumbnail) ? (
                <>
                  <Image
                    src={getPreviewUrl(article.thumbnail)}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-200">
                  <FileText className="w-32 h-32 mb-4" />
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-grey-200">
              <HtmlRenderer html={article.content} />
            </div>
          </article>

          {/* Action Bar */}
          <ActionBar article={article} />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-grey-900">
                  Artikel Terkait
                </h2>
                <Link
                  href="/article"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <span>Lihat Semua</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((item) => {
                  const formattedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";
                  const truncatedContent =
                    item.content && item.content.length > 150
                      ? `${item.content.substring(0, 150)}...`
                      : item.content || "";

                  return (
                    <ArticleCard
                      key={item.id}
                      article={{
                        ...item,
                      }}
                      formattedDate={formattedDate}
                      truncatedContent={truncatedContent}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
