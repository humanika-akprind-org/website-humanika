"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import GalleryCategoryTable from "@/components/admin/gallery/category/Table";
import type { GalleryCategory } from "@/types/gallery-category";
import {
  getGalleryCategories,
  deleteGalleryCategory,
} from "@/use-cases/api/gallery-category";
import { useToast } from "@/hooks/use-toast";

export default function GalleryCategoriesPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getGalleryCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery categories",
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
      await deleteGalleryCategory(categoryId);
      toast({
        title: "Success",
        description: "Gallery category deleted successfully",
      });
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gallery Categories
          </h1>
          <p className="text-gray-600">Manage gallery categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/content/galleries/categories/add"
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
        <GalleryCategoryTable categories={categories} onDelete={handleDelete} />
      )}
    </div>
  );
}
