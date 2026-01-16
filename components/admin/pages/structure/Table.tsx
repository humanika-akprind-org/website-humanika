"use client";

import { useState, useRef } from "react";
import { FiEye, FiEdit, FiTrash, FiDownload } from "react-icons/fi";
import { Network } from "lucide-react";
import Image from "next/image";
import type { OrganizationalStructure } from "@/types/structure";
import StatusChip from "../../ui/chip/Status";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import Checkbox from "../../ui/checkbox/Checkbox";
import Pagination from "../../ui/pagination/Pagination";
import AddButton from "../../ui/button/AddButton";
import EmptyState from "../../ui/EmptyState";
import SortIcon from "../../ui/SortIcon";
import ViewModal from "../../ui/modal/ViewModal";
import {
  getGoogleDriveDirectUrl,
  getFileIdFromFile,
} from "@/lib/google-drive/file-utils";

interface StructureTableProps {
  structures: OrganizationalStructure[];
  selectedStructures: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onStructureSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewStructure: (id: string) => void;
  onEditStructure: (id: string) => void;
  onDeleteStructure: (structure?: OrganizationalStructure) => void;
  onPageChange: (page: number) => void;
  onAddStructure: () => void;
}

export default function StructureTable({
  structures,
  selectedStructures,
  loading,
  currentPage,
  totalPages,
  onStructureSelect,
  onSelectAll,
  onViewStructure,
  onEditStructure,
  onDeleteStructure,
  onPageChange,
  onAddStructure,
}: StructureTableProps) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Sort structures
  const sortedStructures = [...structures].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
        break;
      case "period":
        aValue = a.period?.name?.toLowerCase() || "";
        bValue = b.period?.name?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.status?.toLowerCase() || "";
        bValue = b.status?.toLowerCase() || "";
        break;
      case "decree":
        aValue = a.decree ? 1 : 0;
        bValue = b.decree ? 1 : 0;
        break;
      case "structure":
        aValue = a.structure ? 1 : 0;
        bValue = b.structure ? 1 : 0;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
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

  const handleStructureSelect = (id: string) => {
    onStructureSelect(id);
  };

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleViewStructure = (id: string) => {
    onViewStructure(id);
  };

  const handleEditStructure = (id: string) => {
    onEditStructure(id);
  };

  const handleAddStructure = () => {
    onAddStructure();
  };

  // Handle download decree
  const handleDownloadDecree = (structure: OrganizationalStructure) => {
    if (structure.decree) {
      const downloadUrl = getGoogleDriveDirectUrl(structure.decree, "download");
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    }
  };

  // Handle download structure image
  const handleDownloadImage = (structure: OrganizationalStructure) => {
    if (structure.structure) {
      const fileId = getFileIdFromFile(structure.structure);
      if (fileId) {
        const downloadUrl = getGoogleDriveDirectUrl(fileId, "download");
        if (downloadUrl) {
          window.open(downloadUrl, "_blank");
        }
      }
    }
  };

  // Get image URL from structure image (file ID or URL)
  const getImageUrl = (structureImage: string | null | undefined): string => {
    if (!structureImage) return "";

    if (structureImage.includes("drive.google.com")) {
      const fileIdMatch = structureImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `/api/drive-image?fileId=${fileIdMatch[1]}`;
      }
      return structureImage;
    } else if (structureImage.match(/^[a-zA-Z0-9_-]+$/)) {
      return `/api/drive-image?fileId=${structureImage}`;
    } else {
      return structureImage;
    }
  };

  const handleImageClick = (structure: OrganizationalStructure) => {
    const imageUrl = getImageUrl(structure.structure);
    if (imageUrl) {
      setCurrentImageUrl(imageUrl);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentImageUrl("");
  };

  if (structures.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
        <EmptyState
          icon={<Network size={48} className="mx-auto" />}
          title="No organizational structures found"
          description="Get started by creating your first organizational structure."
          actionButton={
            <AddButton onClick={handleAddStructure} text="Add Structure" />
          }
        />
      </div>
    );
  }

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
                    sortedStructures.length > 0 &&
                    selectedStructures.length === sortedStructures.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Structure Name
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="name"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("period")}
              >
                <div className="flex items-center">
                  Period
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="period"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="status"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("decree")}
              >
                <div className="flex items-center">
                  Decree
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="decree"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("structure")}
              >
                <div className="flex items-center">
                  Image
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="structure"
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
            {sortedStructures.map((structure, index) => (
              <tr
                key={structure.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedStructures.includes(structure.id)}
                    onChange={() => handleStructureSelect(structure.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {structure.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {structure.period?.name || "No period"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusChip status={structure.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {structure.decree ? (
                    <a
                      href={
                        structure.decree.startsWith("http")
                          ? structure.decree
                          : `https://drive.google.com/file/d/${structure.decree}/view`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {`Decree - ${structure.name}`}
                    </a>
                  ) : (
                    <span className="text-gray-400">No decree</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {structure.structure ? (
                    <button
                      onClick={() => handleImageClick(structure)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                    >
                      <FiEye className="mr-1.5" size={14} />
                      View Image
                    </button>
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedStructures.length - 1}
                    hasMultipleItems={sortedStructures.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => handleViewStructure(structure.id)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditStructure(structure.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownloadDecree(structure)}
                      color="default"
                    >
                      <FiDownload className="mr-2" size={14} />
                      Download Decree
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownloadImage(structure)}
                      color="default"
                    >
                      <FiDownload className="mr-2" size={14} />
                      Download Image
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteStructure(structure)}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedStructures.length === 0 && !loading && (
        <EmptyState
          icon={<Network size={48} className="mx-auto" />}
          title="No structures found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={handleAddStructure} text="Add Structure" />
          }
        />
      )}

      {sortedStructures.length > 0 && (
        <Pagination
          usersLength={sortedStructures.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      <ViewModal
        isOpen={isModalOpen}
        title="Structure Image"
        onClose={handleCloseModal}
      >
        <div className="flex justify-center">
          <Image
            src={currentImageUrl}
            alt="Structure photo - enlarged"
            width={600}
            height={400}
            className="max-w-full max-h-100 object-contain rounded-lg"
            onError={(e) => {
              console.error(
                "Image failed to load in modal:",
                currentImageUrl,
                e
              );
            }}
          />
        </div>
      </ViewModal>
    </div>
  );
}
