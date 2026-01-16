"use client";

import { useRef, useState } from "react";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { Newspaper } from "lucide-react";
import type { Article } from "@/types/article";
import Checkbox from "../../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";
import ThumbnailCell from "../../ui/ThumbnailCell";
import StatusChip from "../../ui/chip/Status";

interface ArticleTableProps {
  articles: Article[];
  selectedArticles: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onArticleSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewArticle: (article: Article) => void;
  onEditArticle: (id: string) => void;
  onDeleteArticle: (article?: Article) => void;
  onPageChange: (page: number) => void;
  onAddArticle: () => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  selectedArticles,
  loading,
  currentPage,
  totalPages,
  onArticleSelect,
  onSelectAll,
  onViewArticle,
  onEditArticle,
  onDeleteArticle,
  onPageChange,
  onAddArticle,
}) => {
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort articles
  const sortedArticles = [...articles].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "category":
        aValue = a.category?.name?.toLowerCase() || "";
        bValue = b.category?.name?.toLowerCase() || "";
        break;
      case "period":
        aValue = a.period?.name?.toLowerCase() || "";
        bValue = b.period?.name?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "author":
        aValue = a.author?.name?.toLowerCase() || "";
        bValue = b.author?.name?.toLowerCase() || "";
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleArticleSelect = (id: string) => {
    onArticleSelect(id);
  };

  const handleEditArticle = (id: string) => {
    onEditArticle(id);
  };

  const handleAddArticle = () => {
    onAddArticle();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
              >
                <Checkbox
                  checked={
                    sortedArticles.length > 0 &&
                    selectedArticles.length === sortedArticles.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Article Title
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="title"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="category"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("period")}
              >
                <div className="flex items-center">
                  Period
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="period"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="status"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("author")}
              >
                <div className="flex items-center">
                  Author
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="author"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedArticles.map((article, index) => (
              <tr
                key={article.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => handleArticleSelect(article.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ThumbnailCell
                    thumbnail={article.thumbnail}
                    name={article.title}
                    categoryName={article.category?.name}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {article.category?.name || "No category"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {article.period?.name || "No period"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusChip status={article.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {article.author?.name || "Unknown"}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedArticles.length - 1}
                    hasMultipleItems={sortedArticles.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewArticle(article)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditArticle(article.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteArticle(article)}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedArticles.length === 0 && !loading && (
        <EmptyState
          icon={<Newspaper size={48} className="mx-auto" />}
          title="No articles found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={handleAddArticle} text="Add Article" />
          }
        />
      )}

      {sortedArticles.length > 0 && (
        <Pagination
          usersLength={sortedArticles.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ArticleTable;
