import React from "react";
import { getArticle } from "use-cases/api/article";
import type { Article } from "types/article";
import Image from "next/image";
import ArticleCard from "components/public/article/ArticleCard";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import { Calendar, User, ArrowLeft, Share2, Bookmark, Eye } from "lucide-react";
import Link from "next/link";

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

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let article: Article | null = null;
  let error: string | null = null;

  try {
    article = await getArticle(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load article data";
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
            href="/articles"
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
            href="/articles"
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
                href="/articles"
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
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <Bookmark className="w-4 h-4" />
                <span>Bookmark</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Thumbnail Image */}
          {article.thumbnail && (
            <div className="mb-12">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
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
              </div>
            </div>
          )}

          {/* Author Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-grey-200">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {article.author.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-grey-900 mb-2">
                  {article.author.name}
                </h3>
                <p className="text-grey-600 mb-3">{article.author.role}</p>
                <p className="text-grey-700">
                  Penulis artikel dengan fokus pada perkembangan teknologi dan
                  informatika. Bergabung dengan HUMANIKA untuk berbagi
                  pengetahuan dan pengalaman.
                </p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-grey-200">
              <HtmlRenderer html={article.content} />
            </div>
          </article>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-grey-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-grey-700 font-medium">
                  Share artikel:
                </span>
                <div className="flex gap-3">
                  {["Facebook", "Twitter", "LinkedIn", "WhatsApp"].map(
                    (platform) => (
                      <button
                        key={platform}
                        className="w-10 h-10 rounded-full bg-grey-100 flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        title={`Share on ${platform}`}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
                  <Bookmark className="w-4 h-4" />
                  <span>Simpan Artikel</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-medium">
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-grey-900">
                  Artikel Terkait
                </h2>
                <Link
                  href="/articles"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <span>Lihat Semua</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {article.relatedArticles.map((item) => {
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

          {/* Newsletter CTA */}
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Tetap Terhubung dengan HUMANIKA
              </h3>
              <p className="text-primary-100/90 max-w-2xl mx-auto mb-8">
                Dapatkan update terbaru tentang artikel, kegiatan, dan
                kesempatan bergabung dengan HUMANIKA langsung di inbox Anda.
              </p>
              <form className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-colors font-semibold"
                  >
                    Berlangganan
                  </button>
                </div>
                <p className="text-sm text-primary-200/80 mt-3">
                  Kami tidak akan mengirim spam. Batalkan kapan saja.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
