"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiUser, FiImage, FiEye } from "react-icons/fi";
import type { Article } from "@/types/article";
import type { Status } from "@/types/enums";
import { Status as StatusEnum } from "@/types/enums";
import ArticleStats from "./Stats";
import ArticleFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface ArticleTableProps {
  articles: Article[];
  onDelete: (id: string) => void;
  accessToken?: string;
}

export default function ArticleTable({
  articles,
  onDelete,
}: ArticleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleStatusFilterChange = (status: string) =>
    (status === "all" ||
      Object.values(StatusEnum).includes(status as unknown as StatusEnum)) &&
    setStatusFilter(status === "all" ? "all" : (status as unknown as Status));

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.PUBLISH:
        return "bg-green-100 text-green-800";
      case StatusEnum.PRIVATE:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.ARCHIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get preview URL from image (file ID or URL)
  const getPreviewUrl = (image: string | null | undefined): string => {
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
  };

  const handleDelete = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedArticles.forEach((id) => onDelete(id));
      setSelectedArticles([]);
    } else if (articleToDelete) {
      onDelete(articleToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
    setIsBulkDelete(false);
  };

  // Filter articles based on search term and filters
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      article.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;

    const matchesPeriod =
      periodFilter === "all" || article.period?.id === periodFilter;

    const matchesCategory =
      categoryFilter === "all" || article.category?.id === categoryFilter;

    return matchesSearch && matchesStatus && matchesPeriod && matchesCategory;
  });

  // Toggle article selection
  const toggleArticleSelection = (id: string) => {
    setSelectedArticles((prev) =>
      prev.includes(id)
        ? prev.filter((articleId) => articleId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) return;

    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No articles found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first article.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      <ArticleStats articles={filteredArticles} />

      <ArticleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter.toString()}
        onStatusFilterChange={handleStatusFilterChange}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        selectedCount={selectedArticles.length}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
        </div>

        {selectedArticles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedArticles.length} article
              {selectedArticles.length > 1 ? "s" : ""} selected
            </span>
          </div>
        )}
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredArticles.length > 0 &&
                      selectedArticles.length === filteredArticles.length
                    }
                    onChange={() => {
                      if (selectedArticles.length === filteredArticles.length) {
                        setSelectedArticles([]);
                      } else {
                        setSelectedArticles(
                          filteredArticles.map((article) => article.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thumbnail
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Article
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: "300px", minWidth: "300px" }}
                >
                  Content Preview
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Published
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleArticleSelection(article.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12">
                        {article.thumbnail && !imageErrors.has(article.id) ? (
                          <Image
                            className="h-12 w-12 rounded-lg object-cover"
                            src={getPreviewUrl(article.thumbnail)}
                            alt={article.title}
                            width={48}
                            height={48}
                            onError={() =>
                              setImageErrors((prev) =>
                                new Set(prev).add(article.id)
                              )
                            }
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FiImage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ width: "300px", minWidth: "300px" }}
                    >
                      <div className="text-sm text-gray-600 break-words">
                        {article.content
                          ? article.content
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 100) +
                            (article.content.length > 100 ? "..." : "")
                          : "No content"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {article.category?.name || "No category"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          article.status
                        )}`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.isPublished ? (
                        <div className="flex items-center">
                          <FiEye className="mr-1 text-green-500" size={14} />
                          {article.publishedAt
                            ? formatDate(article.publishedAt)
                            : "Yes"}
                        </div>
                      ) : (
                        "Draft"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" size={14} />
                        {article.author?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/content/articles/edit/${article.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit article"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(article)}
                          title="Delete article"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No articles found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {articles.length === 0
                        ? "Get started by creating your first article."
                        : "No articles match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredArticles.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredArticles.length}</span> of{" "}
              <span className="font-medium">{articles.length}</span> articles
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        articleName={articleToDelete?.title || ""}
        count={isBulkDelete ? selectedArticles.length : 1}
        isLoading={false}
      />
    </div>
  );
}
