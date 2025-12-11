import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import { getArticles, deleteArticle } from "@/use-cases/api/article";

export const useArticleManagement = () => {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles();
      setArticles(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / 10)); // Assuming 10 items per page
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const toggleArticleSelection = useCallback((id: string) => {
    setSelectedArticles((prev) =>
      prev.includes(id)
        ? prev.filter((articleId) => articleId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedArticles((prev) =>
      prev.length === articles.length ? [] : articles.map((article) => article.id)
    );
  }, [articles]);

  const handleAddArticle = useCallback(() => {
    router.push("/admin/content/articles/add");
  }, [router]);

  const handleEditArticle = useCallback((id: string) => {
    router.push(`/admin/content/articles/edit/${id}`);
  }, [router]);

  const handleViewArticle = useCallback((article: Article) => {
    setCurrentArticle(article);
    setShowViewModal(true);
  }, []);

  const handleDelete = useCallback((article?: Article) => {
    if (article) {
      setCurrentArticle(article);
    }
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      setError(null);
      if (selectedArticles.length > 0) {
        // Bulk delete
        await Promise.all(
          selectedArticles.map((id) => deleteArticle(id))
        );
        setSuccess(`${selectedArticles.length} articles deleted successfully`);
      } else if (currentArticle) {
        // Single delete
        await deleteArticle(currentArticle.id);
        setSuccess("Article deleted successfully");
      }

      setSelectedArticles([]);
      setShowDeleteModal(false);
      setCurrentArticle(null);
      await fetchArticles();
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article");
    }
  }, [selectedArticles, currentArticle, fetchArticles]);

  return {
    articles,
    loading,
    error,
    success,
    selectedArticles,
    searchTerm,
    statusFilter,
    periodFilter,
    categoryFilter,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentArticle,
    setSearchTerm,
    setStatusFilter,
    setPeriodFilter,
    setCategoryFilter,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentArticle,
    toggleArticleSelection,
    toggleSelectAll,
    handleAddArticle,
    handleEditArticle,
    handleViewArticle,
    handleDelete,
    confirmDelete,
  };
};
