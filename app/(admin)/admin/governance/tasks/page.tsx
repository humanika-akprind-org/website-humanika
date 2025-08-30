// app/dashboard/organizational-structure/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiX,
  FiChevronDown,
  FiClock,
  FiCheckCircle,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiFile,
} from "react-icons/fi";

interface OrganizationalStructure {
  id: string;
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  order: number;
  fileUrl?: string;
  mimeType?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationalStructurePage() {
  const router = useRouter();
  const [structures, setStructures] = useState<OrganizationalStructure[]>([
    {
      id: "1",
      name: "Struktur Organisasi 2023",
      status: "APPROVED",
      order: 1,
      fileUrl: "/documents/org-structure-2023.pdf",
      mimeType: "application/pdf",
      fileSize: 2048576,
      createdAt: "2023-01-15T09:32:45Z",
      updatedAt: "2023-01-18T14:20:12Z",
    },
    {
      id: "2",
      name: "Struktur Divisi Teknologi",
      status: "PENDING",
      order: 2,
      fileUrl: "/documents/tech-division-structure.pdf",
      mimeType: "application/pdf",
      fileSize: 1536921,
      createdAt: "2023-02-10T14:20:12Z",
      updatedAt: "2023-02-10T14:20:12Z",
    },
    {
      id: "3",
      name: "Struktur Tim Proyek A",
      status: "APPROVED",
      order: 3,
      fileUrl: "/documents/project-a-team-structure.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSize: 512432,
      createdAt: "2023-03-05T11:45:23Z",
      updatedAt: "2023-03-07T13:42:18Z",
    },
    {
      id: "4",
      name: "Struktur Organisasi 2022",
      status: "ARCHIVED",
      order: 4,
      fileUrl: "/documents/org-structure-2022.pdf",
      mimeType: "application/pdf",
      fileSize: 1987654,
      createdAt: "2022-12-20T16:30:55Z",
      updatedAt: "2023-01-10T09:15:22Z",
    },
    {
      id: "5",
      name: "Struktur Komite Direksi",
      status: "REJECTED",
      order: 5,
      fileUrl: "/documents/board-committee-structure.pdf",
      mimeType: "application/pdf",
      fileSize: 3072000,
      createdAt: "2023-04-18T08:12:37Z",
      updatedAt: "2023-04-20T10:35:21Z",
    },
  ]);

  const [selectedStructures, setSelectedStructures] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStructure, setCurrentStructure] =
    useState<OrganizationalStructure | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter structures based on search term and filters
  const filteredStructures = structures.filter((structure) => {
    const matchesSearch = structure.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || structure.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort structures
  const sortedStructures = [...filteredStructures].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "order":
        aValue = a.order;
        bValue = b.order;
        break;
      case "createdAt":
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      default:
        aValue = a.order;
        bValue = b.order;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Toggle structure selection
  const toggleStructureSelection = (id: string) => {
    if (selectedStructures.includes(id)) {
      setSelectedStructures(
        selectedStructures.filter((structureId) => structureId !== id)
      );
    } else {
      setSelectedStructures([...selectedStructures, id]);
    }
  };

  // Select all structures on current page
  const toggleSelectAll = () => {
    if (selectedStructures.length === filteredStructures.length) {
      setSelectedStructures([]);
    } else {
      setSelectedStructures(
        filteredStructures.map((structure) => structure.id)
      );
    }
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Navigate to add structure page
  const handleAddStructure = () => {
    router.push("/dashboard/organizational-structure/create");
  };

  // Navigate to edit structure page
  const handleEditStructure = (id: string) => {
    router.push(`/dashboard/organizational-structure/edit/${id}`);
  };

  // View structure details
  const handleViewStructure = (id: string) => {
    router.push(`/dashboard/organizational-structure/view/${id}`);
  };

  // Download structure file
  const handleDownloadStructure = (structure: OrganizationalStructure) => {
    if (structure.fileUrl) {
      // In a real application, this would trigger a download
      console.log(
        `Downloading structure: ${structure.name} from ${structure.fileUrl}`
      );
      // You might want to use something like:
      // window.open(structure.fileUrl, '_blank');
    }
  };

  // Delete structure(s)
  const handleDelete = (structure?: OrganizationalStructure) => {
    if (structure) {
      setCurrentStructure(structure);
    }
    setShowDeleteModal(true);
  };

  // Reorder structures
  const handleReorder = (id: string, direction: "up" | "down") => {
    setStructures((prev) => {
      const newStructures = [...prev];
      const index = newStructures.findIndex((s) => s.id === id);

      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === newStructures.length - 1)
      ) {
        return newStructures;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      // Swap orders
      const tempOrder = newStructures[index].order;
      newStructures[index].order = newStructures[targetIndex].order;
      newStructures[targetIndex].order = tempOrder;

      // Swap positions in array
      [newStructures[index], newStructures[targetIndex]] = [
        newStructures[targetIndex],
        newStructures[index],
      ];

      return newStructures;
    });
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentStructure) {
      // Delete single structure
      setStructures(
        structures.filter((structure) => structure.id !== currentStructure.id)
      );
    } else if (selectedStructures.length > 0) {
      // Delete multiple structures
      setStructures(
        structures.filter(
          (structure) => !selectedStructures.includes(structure.id)
        )
      );
      setSelectedStructures([]);
    }
    setShowDeleteModal(false);
    setCurrentStructure(null);
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string | undefined) => {
    if (!mimeType) return <FiFile className="text-gray-400" />;

    if (mimeType.includes("pdf")) return <FiFile className="text-red-500" />;
    if (mimeType.includes("word")) return <FiFile className="text-blue-500" />;
    if (mimeType.includes("excel")) {
      return <FiFile className="text-green-500" />;
    }
    if (mimeType.includes("image")) {
      return <FiFile className="text-purple-500" />;
    }
    return <FiFile className="text-gray-400" />;
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <FiArrowUp size={14} />
    ) : (
      <FiArrowDown size={14} />
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Struktur Organisasi
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola semua dokumen struktur organisasi
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddStructure}
        >
          <FiPlus className="mr-2" />
          Tambah Struktur
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Struktur
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {structures.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Menunggu</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {structures.filter((s) => s.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Disetujui</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {structures.filter((s) => s.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Diarsipkan</h3>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiUsers className="text-gray-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {structures.filter((s) => s.status === "ARCHIVED").length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari struktur organisasi..."
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="mr-2 text-gray-500" />
            Filter
            <FiChevronDown
              className={`ml-2 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="PENDING">Menunggu</option>
                <option value="APPROVED">Disetujui</option>
                <option value="REJECTED">Ditolak</option>
                <option value="ARCHIVED">Diarsipkan</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedStructures.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedStructures.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Hapus Terpilih ({selectedStructures.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Structures Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredStructures.length > 0 &&
                      selectedStructures.length === filteredStructures.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("order")}
                >
                  <div className="flex items-center">
                    No. Urut
                    {getSortIcon("order")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Nama Struktur
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  File
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Dibuat
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStructures.map((structure, index) => (
                <tr
                  key={structure.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStructures.includes(structure.id)}
                      onChange={() => toggleStructureSelection(structure.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {structure.order}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {structure.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(structure.mimeType)}
                      <div className="ml-2">
                        <div className="text-sm text-gray-900">
                          {structure.mimeType
                            ? structure.mimeType.split("/")[1].toUpperCase()
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(structure.fileSize)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        structure.status
                      )}`}
                    >
                      {structure.status === "PENDING"
                        ? "Menunggu"
                        : structure.status === "APPROVED"
                        ? "Disetujui"
                        : structure.status === "REJECTED"
                        ? "Ditolak"
                        : "Diarsipkan"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(structure.createdAt)}
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {structure.fileUrl && (
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => handleDownloadStructure(structure)}
                          title="Download file"
                        >
                          <FiDownload size={16} />
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleViewStructure(structure.id)}
                        title="Lihat detail"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => handleEditStructure(structure.id)}
                        title="Edit struktur"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(structure)}
                        title="Hapus struktur"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <div className="flex flex-col">
                        <button
                          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                          onClick={() => handleReorder(structure.id, "up")}
                          disabled={index === 0}
                          title="Pindah ke atas"
                        >
                          <FiArrowUp size={12} />
                        </button>
                        <button
                          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                          onClick={() => handleReorder(structure.id, "down")}
                          disabled={index === sortedStructures.length - 1}
                          title="Pindah ke bawah"
                        >
                          <FiArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedStructures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiUsers size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Tidak ada struktur organisasi ditemukan
            </p>
            <p className="text-gray-400 mt-1">
              Coba sesuaikan pencarian atau filter Anda
            </p>
          </div>
        )}

        {/* Table Footer */}
        {sortedStructures.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Menampilkan{" "}
              <span className="font-medium">{sortedStructures.length}</span>{" "}
              dari <span className="font-medium">{structures.length}</span>{" "}
              struktur
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Sebelumnya
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Konfirmasi Penghapusan
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentStructure(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentStructure
                  ? `Apakah Anda yakin ingin menghapus struktur "${currentStructure.name}"? Tindakan ini tidak dapat dibatalkan.`
                  : `Apakah Anda yakin ingin menghapus ${selectedStructures.length} struktur terpilih? Tindakan ini tidak dapat dibatalkan.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentStructure(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
