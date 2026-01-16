"use client";

import { useRef, useState } from "react";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { Images } from "lucide-react";
import type { Gallery } from "@/types/gallery";
import Checkbox from "../../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";
import ThumbnailCell from "../../ui/ThumbnailCell";
import { useResourcePermission } from "@/hooks/usePermission";

interface GalleryTableProps {
  galleries: Gallery[];
  selectedGalleries: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onGallerySelect: (id: string) => void;
  onSelectAll: () => void;
  onViewGallery: (gallery: Gallery) => void;
  onEditGallery: (id: string) => void;
  onDeleteGallery: (gallery?: Gallery) => void;
  onPageChange: (page: number) => void;
  onAddGallery: () => void;
}

export default function GalleryTable({
  galleries,
  selectedGalleries,
  loading,
  currentPage,
  totalPages,
  onGallerySelect,
  onSelectAll,
  onViewGallery,
  onEditGallery,
  onDeleteGallery,
  onPageChange,
  onAddGallery,
}: GalleryTableProps) {
  const { canAdd, canEdit, canDelete } = useResourcePermission("galleries");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  // Sort galleries
  const sortedGalleries = [...galleries].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "event":
        aValue = a.event?.name?.toLowerCase() || "";
        bValue = b.event?.name?.toLowerCase() || "";
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
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
    onSelectAll?.();
  };

  const handleSelectGallery = (id: string) => {
    onGallerySelect?.(id);
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
                    sortedGalleries.length > 0 &&
                    selectedGalleries.length === sortedGalleries.length
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
                  Gallery
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
                onClick={() => handleSort("event")}
              >
                <div className="flex items-center">
                  Event
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="event"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="createdAt"
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
            {sortedGalleries.map((gallery, index) => (
              <tr
                key={gallery.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedGalleries.includes(gallery.id)}
                    onChange={() => handleSelectGallery(gallery.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ThumbnailCell
                    thumbnail={gallery.image}
                    name={gallery.title}
                    categoryName={gallery.event?.name}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {gallery.event?.name || "No event"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(new Date(gallery.createdAt))}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedGalleries.length - 1}
                    hasMultipleItems={sortedGalleries.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewGallery(gallery)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    {canEdit() && (
                      <DropdownMenuItem
                        onClick={() => onEditGallery(gallery.id)}
                        color="blue"
                      >
                        <FiEdit className="mr-2" size={14} />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete() && (
                      <DropdownMenuItem
                        onClick={() => onDeleteGallery(gallery)}
                        color="red"
                      >
                        <FiTrash className="mr-2" size={14} />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedGalleries.length === 0 && !loading && (
        <EmptyState
          icon={<Images size={48} className="mx-auto" />}
          title="No galleries found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            canAdd() ? (
              <AddButton onClick={onAddGallery} text="Add Gallery" />
            ) : null
          }
        />
      )}

      {/* Table Footer */}
      {sortedGalleries.length > 0 && (
        <Pagination
          usersLength={sortedGalleries.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
