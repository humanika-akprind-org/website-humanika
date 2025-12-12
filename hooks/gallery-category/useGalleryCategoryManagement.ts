import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteGalleryCategory } from "@/use-cases/api/gallery-category";
import type { GalleryCategory } from "@/types/gallery-category";
import { useGalleryCategories } from "./useGalleryCategories";

export function useGalleryCategoryManagement() {
  const router = useRouter();
  const { categories, isLoading, error, refetch } = useGalleryCategories();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<GalleryCategory | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Apply client-side filtering and pagination
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()))
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCategories.length / 10));
  }, [filteredCategories, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleCategorySelection = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(
        selectedCategories.filter((categoryId) => categoryId !== id)
      );
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((category) => category.id));
    }
  };

  const handleAddCategory = () => {
    router.push("/admin/content/galleries/categories/add");
  };

  const handleEditCategory = (id: string) => {
    router.push(`/admin/content/galleries/categories/edit/${id}`);
  };

  const handleViewCategory = (category: GalleryCategory) => {
    setCurrentCategory(category);
    setShowViewModal(true);
  };

  const handleDelete = (category?: GalleryCategory) => {
    if (category) {
      setCurrentCategory(category);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentCategory) {
        await deleteGalleryCategory(currentCategory.id);
        setSuccess("Gallery category deleted successfully");
        refetch();
      } else if (selectedCategories.length > 0) {
        for (const categoryId of selectedCategories) {
          await deleteGalleryCategory(categoryId);
        }
        setSelectedCategories([]);
        setSuccess(
          `${selectedCategories.length} categories deleted successfully`
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setShowDeleteModal(false);
      setCurrentCategory(null);
    }
  };

  return {
    categories: filteredCategories,
    loading: isLoading,
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
