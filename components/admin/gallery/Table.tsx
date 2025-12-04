import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiImage, FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import type { Gallery } from "@/types/gallery";
import { useFile } from "@/hooks/useFile";
import GalleryStats from "./Stats";
import GalleryFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface GalleryTableProps {
  galleries: Gallery[];
  onDelete: (id: string) => void;
  accessToken?: string;
}

export default function GalleryTable({
  galleries,
  onDelete,
  accessToken,
}: GalleryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const { deleteFile } = useFile(accessToken || "");

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const getFileIcon = (mimeType: string | undefined) => {
    if (!mimeType) return <FiImage className="text-gray-400" />;
    if (mimeType.startsWith("image/"))
      return <FiImage className="text-blue-500" />;
    if (mimeType.startsWith("video/"))
      return <FiImage className="text-red-500" />;
    return <FiImage className="text-gray-400" />;
  };

  // Helper function to check if image is from Google Drive (either URL or file ID)
  const isGoogleDriveImage = (image: string | null | undefined): boolean => {
    if (!image) return false;
    return (
      image.includes("drive.google.com") ||
      image.match(/^[a-zA-Z0-9_-]+$/) !== null
    );
  };

  // Helper function to get file ID from image (either URL or file ID)
  const getFileIdFromImage = (
    image: string | null | undefined
  ): string | null => {
    if (!image) return null;

    if (image.includes("drive.google.com")) {
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
      return image;
    }
    return null;
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

  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch =
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gallery.event?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesEvent =
      eventFilter === "all" || gallery.event?.id === eventFilter;

    return matchesSearch && matchesEvent;
  });

  const handleSelectAll = () => {
    if (selectedGalleries.length === filteredGalleries.length) {
      setSelectedGalleries([]);
    } else {
      setSelectedGalleries(filteredGalleries.map((gallery) => gallery.id));
    }
  };

  const handleSelectGallery = (id: string) => {
    if (selectedGalleries.includes(id)) {
      setSelectedGalleries(
        selectedGalleries.filter((galleryId) => galleryId !== id)
      );
    } else {
      setSelectedGalleries([...selectedGalleries, id]);
    }
  };

  const handleDelete = (gallery?: Gallery) => {
    if (gallery) {
      setGalleryToDelete(gallery);
      setIsBulkDelete(false);
    } else {
      setIsBulkDelete(true);
    }
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isBulkDelete) {
        // Delete files for all selected galleries
        for (const galleryId of selectedGalleries) {
          const gallery = galleries.find((g) => g.id === galleryId);
          if (gallery && isGoogleDriveImage(gallery.image)) {
            const fileId = getFileIdFromImage(gallery.image);
            if (fileId) {
              try {
                await deleteFile(fileId);
              } catch (deleteError) {
                console.warn(
                  `Failed to delete file for gallery ${gallery.title}:`,
                  deleteError
                );
                // Continue with other deletions even if one fails
              }
            }
          }
        }
        selectedGalleries.forEach((id) => onDelete(id));
        setSelectedGalleries([]);
      } else if (galleryToDelete) {
        // Delete file for single gallery
        if (isGoogleDriveImage(galleryToDelete.image)) {
          const fileId = getFileIdFromImage(galleryToDelete.image);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn(
                `Failed to delete file for gallery ${galleryToDelete.title}:`,
                deleteError
              );
              // Continue with gallery deletion even if file deletion fails
            }
          }
        }
        onDelete(galleryToDelete.id);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      // Continue with gallery deletion even if file deletion fails
    }

    setIsDeleteModalOpen(false);
    setGalleryToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setGalleryToDelete(null);
    setIsBulkDelete(false);
  };

  return (
    <div className="space-y-6">
      <GalleryStats galleries={galleries} />

      <GalleryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        eventFilter={eventFilter}
        onEventFilterChange={setEventFilter}
        selectedCount={selectedGalleries.length}
        onDeleteSelected={() => handleDelete()}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                    checked={
                      selectedGalleries.length === filteredGalleries.length &&
                      filteredGalleries.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gallery
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGalleries.length > 0 ? (
                filteredGalleries.map((gallery) => (
                  <tr key={gallery.id} className="hover:bg-gray-50">
                    <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                        checked={selectedGalleries.includes(gallery.id)}
                        onChange={() => handleSelectGallery(gallery.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {gallery.image ? (
                            <Image
                              className="h-12 w-12 rounded-lg object-cover"
                              src={getPreviewUrl(gallery.image)}
                              alt={gallery.title}
                              width={48}
                              height={48}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FiImage className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {gallery.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {gallery.event?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon("image")}
                        <span className="ml-2 text-sm text-gray-500">
                          Image
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      N/A
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(gallery.createdAt))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/content/galleries/${gallery.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View gallery"
                        >
                          <FiEye size={16} />
                        </Link>
                        <Link
                          href={`/admin/content/galleries/edit/${gallery.id}`}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Edit gallery"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(gallery)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete gallery"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No galleries found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {galleries.length === 0
                        ? "Get started by creating your first gallery."
                        : "No galleries match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredGalleries.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredGalleries.length}</span> of{" "}
              <span className="font-medium">{galleries.length}</span> galleries
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
        galleryName={galleryToDelete?.title || ""}
        count={isBulkDelete ? selectedGalleries.length : 1}
        isLoading={false}
      />
    </div>
  );
}
