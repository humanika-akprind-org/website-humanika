"use client";

import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";

// Helper function to get preview URL from image (file ID or URL)
function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (image.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `https://drive.google.com/uc?export=view&id=${image}`;
  } else {
    // It's a direct URL or other format
    return image;
  }
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-blue-600">
      <div className="h-48 bg-blue-100 flex items-center relative">
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-medium z-10">
          {article.category?.name || "Uncategorized"}
        </div>
        {article.thumbnail ? (
          <Image
            src={getPreviewUrl(article.thumbnail)}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-blue-600 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formattedDate || "Loading date..."}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          {article.title}
        </h3>
        <p
          className="text-gray-600 mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html:
              article.content && article.content.length > 150
                ? `${article.content.substring(0, 150)}...`
                : article.content || "",
          }}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            By {article.author.name}
          </span>
          <Link
            href={`/article/${article.id}`}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
          >
            Baca
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
