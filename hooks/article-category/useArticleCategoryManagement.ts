import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ArticleCategory } from "@/types/article-category";
import {
  getArticleCategories,
  deleteArticleCategory,
} from "@/use-cases/api/article-category";

export const useArticleCategoryManagement = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ArticleCategory | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticleCategories();
      setCategories(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / 10)); // Assuming 10 items per page
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch article categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleCategorySelection = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedCategories((prev) =>
      prev.length === categories.length ? [] : categories.map((category) => category.id)
    );
  }, [categories]);

  const handleAddCategory = useCallback(() => {
    router.push("/admin/content/articles/categories/add");
  }, [router]);

  const handleEditCategory = useCallback((id: string) => {
    router.push(`/admin/content/articles/categories/edit/${id}`);
  }, [router]);

  const handleViewCategory = useCallback((category: ArticleCategory) => {
    setCurrentCategory(category);
    setShowViewModal(true);
  }, []);

  const handleDelete = useCallback((category?: ArticleCategory) => {
    if (category) {
      setCurrentCategory(category);
    }
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      setError(null);
      if (selectedCategories.length > 0) {
        // Bulk delete
        await Promise.all(
          selectedCategories.map((id) => deleteArticleCategory(id))
        );
        setSuccess(`${selectedCategories.length} categories deleted successfully`);
      } else if (currentCategory) {
        // Single delete
        await deleteArticleCategory(currentCategory.id);
        setSuccess("Category deleted successfully");
      }

      setSelectedCategories([]);
      setShowDeleteModal(false);
      setCurrentCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
    }
  }, [selectedCategories, currentCategory, fetchCategories]);

  return {
    categories,
    loading,
    error,
    success,
    selectedCategories,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentCategory,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentCategory,
    toggleCategorySelection,
    toggleSelectAll,
    handleAddCategory,
    handleEditCategory,
    handleViewCategory,
    handleDelete,
    confirmDelete,
  };
};
