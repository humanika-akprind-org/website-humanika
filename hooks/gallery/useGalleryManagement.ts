import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteGallery } from "@/use-cases/api/gallery";
import type { Gallery } from "@/types/gallery";
import { useGalleries } from "./useGalleries";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import {
  isGoogleDriveFile,
  getFileIdFromFile,
  deleteGoogleDriveFile,
} from "@/lib/google-drive/file-utils";

export function useGalleryManagement() {
  const router = useRouter();
  const { galleries, isLoading, error, refetch } = useGalleries();
  const [allGalleries, setAllGalleries] = useState<Gallery[]>([]);

  const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Store all galleries for bulk operations
  useEffect(() => {
    setAllGalleries(galleries);
  }, [galleries]);

  // Apply client-side filtering and pagination
  const filteredGalleries = allGalleries.filter((gallery) => {
    const matchesSearch = gallery.title
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const matchesEvent =
      eventFilter === "all" || gallery.event?.id === eventFilter;
    const matchesPeriod =
      periodFilter === "all" || gallery.event?.periodId === periodFilter;
    return matchesSearch && matchesEvent && matchesPeriod;
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredGalleries.length / 10));
  }, [filteredGalleries]);

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
        selectedGalleries.filter((galleryId) => galleryId !== id),
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
      // Get access token for Google Drive operations
      const accessToken = await getAccessTokenAction();

      if (currentGallery) {
        // Single gallery deletion: Delete file from Google Drive first, then delete database record
        if (currentGallery.image && isGoogleDriveFile(currentGallery.image)) {
          const fileId = getFileIdFromFile(currentGallery.image);
          if (fileId) {
            await deleteGoogleDriveFile(fileId, accessToken);
          }
        }
        await deleteGallery(currentGallery.id);
        setSuccess("Gallery deleted successfully");
        refetch();
      } else if (selectedGalleries.length > 0) {
        // Bulk deletion: Delete files from Google Drive first, then delete database records
        for (const galleryId of selectedGalleries) {
          // Find the gallery object to get the image URL (use allGalleries to ensure data is available)
          const galleryToDelete = allGalleries.find((g) => g.id === galleryId);
          if (
            galleryToDelete?.image &&
            isGoogleDriveFile(galleryToDelete.image)
          ) {
            const fileId = getFileIdFromFile(galleryToDelete.image);
            if (fileId) {
              await deleteGoogleDriveFile(fileId, accessToken);
            }
          }
          await deleteGallery(galleryId);
        }
        setSelectedGalleries([]);
        setSuccess(
          `${selectedGalleries.length} galleries deleted successfully`,
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
    categoryFilter,
    periodFilter,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentGallery,
    setSearchTerm,
    setEventFilter,
    setCategoryFilter,
    setPeriodFilter,
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
