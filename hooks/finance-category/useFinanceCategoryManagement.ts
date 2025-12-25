"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FinanceCategory } from "@/types/finance-category";
import {
  getFinanceCategories,
  deleteFinanceCategory,
} from "@/use-cases/api/finance-category";
import { useToast } from "@/hooks/use-toast";

export function useFinanceCategoryManagement() {
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<FinanceCategory | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFinanceCategories();
      setCategories(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / 10)); // Assuming 10 per page
    } catch (err) {
      console.error("Error fetching finance categories:", err);
      setError("Failed to fetch finance categories");
      toast({
        title: "Error",
        description: "Failed to fetch finance categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleCategorySelection = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedCategories((prev) =>
      prev.length === categories.length ? [] : categories.map((cat) => cat.id)
    );
  }, [categories]);

  const handleAddCategory = useCallback(() => {
    router.push("/admin/finance/transactions/categories/add");
  }, [router]);

  const handleEditCategory = useCallback(
    (id: string) => {
      router.push(`/admin/finance/transactions/categories/edit/${id}`);
    },
    [router]
  );

  const handleViewCategory = useCallback((category: FinanceCategory) => {
    setCurrentCategory(category);
    setShowViewModal(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedCategories.length > 0) {
      setShowDeleteModal(true);
    }
  }, [selectedCategories]);

  const confirmDelete = useCallback(async () => {
    try {
      setError(null);
      for (const id of selectedCategories) {
        await deleteFinanceCategory(id);
      }
      setSuccess(
        `Successfully deleted ${selectedCategories.length} category${
          selectedCategories.length > 1 ? "ies" : ""
        }`
      );
      toast({
        title: "Success",
        description: `Finance categor${
          selectedCategories.length > 1 ? "ies" : "y"
        } deleted successfully`,
      });
      setSelectedCategories([]);
      setShowDeleteModal(false);
      setCurrentCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting finance categories:", err);
      setError("Failed to delete finance categories");
      toast({
        title: "Error",
        description: "Failed to delete finance categories",
        variant: "destructive",
      });
    }
  }, [selectedCategories, toast, fetchCategories]);

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
}
