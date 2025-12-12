import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteGallery } from "@/use-cases/api/gallery";
import type { Gallery } from "@/types/gallery";
import { useGalleries } from "./useGalleries";

export function useGalleryManagement() {
  const router = useRouter();
  const { galleries, isLoading, error, refetch } = useGalleries();

  const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Apply client-side filtering and pagination
  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch = gallery.title
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const matchesEvent =
      eventFilter === "all" || gallery.event?.id === eventFilter;
    return matchesSearch && matchesEvent;
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredGalleries.length / 10));
  }, [filteredGalleries, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleGallerySelection = (id: string) => {
    if (selectedGalleries.includes(id)) {
      setSelectedGalleries(
        selectedGalleries.filter((galleryId) => galleryId !== id)
      );
    } else {
      setSelectedGalleries([...selectedGalleries, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedGalleries.length === filteredGalleries.length) {
      setSelectedGalleries([]);
    } else {
      setSelectedGalleries(filteredGalleries.map((gallery) => gallery.id));
    }
  };

  const handleAddGallery = () => {
    router.push("/admin/content/galleries/add");
  };

  const handleEditGallery = (id: string) => {
    router.push(`/admin/content/galleries/edit/${id}`);
  };

  const handleViewGallery = (gallery: Gallery) => {
    setCurrentGallery(gallery);
    setShowViewModal(true);
  };

  const handleDelete = (gallery?: Gallery) => {
    if (gallery) {
      setCurrentGallery(gallery);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentGallery) {
        await deleteGallery(currentGallery.id);
        setSuccess("Gallery deleted successfully");
        refetch();
      } else if (selectedGalleries.length > 0) {
        for (const galleryId of selectedGalleries) {
          await deleteGallery(galleryId);
        }
        setSelectedGalleries([]);
        setSuccess(
          `${selectedGalleries.length} galleries deleted successfully`
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting gallery:", error);
    } finally {
      setShowDeleteModal(false);
      setCurrentGallery(null);
    }
  };

  return {
    galleries: filteredGalleries,
    loading: isLoading,
    error,
    success,
    selectedGalleries,
    searchTerm,
    eventFilter,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentGallery,
    setSearchTerm,
    setEventFilter,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentGallery,
    toggleGallerySelection,
    toggleSelectAll,
    handleAddGallery,
    handleEditGallery,
    handleViewGallery,
    handleDelete,
    confirmDelete,
  };
}
