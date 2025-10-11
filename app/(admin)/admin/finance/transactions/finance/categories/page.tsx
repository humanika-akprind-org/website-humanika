"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import FinanceCategoryTable from "@/components/admin/finance/category/Table";
import DeleteModal from "@/components/admin/finance/category/modal/DeleteModal";
import type { FinanceCategory } from "@/types/finance-category";
import { useToast } from "@/hooks/use-toast";

export default function FinanceCategoriesPage() {
  const [_categories, setCategories] = useState<FinanceCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<FinanceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: "",
    categoryName: "",
  });

  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/finance/category");
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
        setFilteredCategories(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch finance categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching finance categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch finance categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/finance/category/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Finance category deleted successfully",
        });
        fetchCategories(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete finance category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting finance category:", error);
      toast({
        title: "Error",
        description: "Failed to delete finance category",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, categoryId: "", categoryName: "" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, categoryId: "", categoryName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Finance Categories Management
          </h1>
          <p className="text-gray-600">Manage and organize your finance categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/finance/transactions/finance/categories/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </div>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ) : (
          <FinanceCategoryTable
            categories={filteredCategories}
            onDelete={handleDelete}
          />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.categoryId)}
        categoryName={deleteModal.categoryName}
      />
    </div>
  );
}
