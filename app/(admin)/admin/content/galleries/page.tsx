// app/dashboard/gallery/page.tsx
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
  FiImage,
  FiCalendar,
  FiFolder,
} from "react-icons/fi";

interface Gallery {
  id: string;
  title: string;
  image: string;
  eventId: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
  updatedAt: string;
  event: {
    name: string;
    date: string;
  };
}

export default function GalleryPage() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<Gallery[]>([
    {
      id: "1",
      title: "Acara Tahun Baru 2023",
      image: "/gallery/new-year-2023.jpg",
      eventId: "event1",
      fileUrl: "/gallery/full/new-year-2023.jpg",
      mimeType: "image/jpeg",
      fileSize: 2048576,
      createdAt: "2023-01-01T09:32:45Z",
      updatedAt: "2023-01-01T09:32:45Z",
      event: {
        name: "Tahun Baru 2023",
        date: "2023-01-01",
      },
    },
    {
      id: "2",
      title: "Workshop Teknologi",
      image: "/gallery/tech-workshop.jpg",
      eventId: "event2",
      fileUrl: "/gallery/full/tech-workshop.jpg",
      mimeType: "image/jpeg",
      fileSize: 1536921,
      createdAt: "2023-02-15T14:20:12Z",
      updatedAt: "2023-02-15T14:20:12Z",
      event: {
        name: "Workshop Teknologi",
        date: "2023-02-15",
      },
    },
    {
      id: "3",
      title: "Seminar Leadership",
      image: "/gallery/leadership-seminar.jpg",
      eventId: "event3",
      fileUrl: "/gallery/full/leadership-seminar.jpg",
      mimeType: "image/jpeg",
      fileSize: 2457600,
      createdAt: "2023-03-10T11:45:23Z",
      updatedAt: "2023-03-10T11:45:23Z",
      event: {
        name: "Seminar Leadership",
        date: "2023-03-10",
      },
    },
    {
      id: "4",
      title: "Pelatihan Marketing",
      image: "/gallery/marketing-training.jpg",
      eventId: "event4",
      fileUrl: "/gallery/full/marketing-training.jpg",
      mimeType: "image/jpeg",
      fileSize: 1876543,
      createdAt: "2023-04-05T16:30:55Z",
      updatedAt: "2023-04-05T16:30:55Z",
      event: {
        name: "Pelatihan Marketing",
        date: "2023-04-05",
      },
    },
    {
      id: "5",
      title: "Company Gathering",
      image: "/gallery/company-gathering.jpg",
      eventId: "event5",
      fileUrl: "/gallery/full/company-gathering.jpg",
      mimeType: "image/jpeg",
      fileSize: 3072000,
      createdAt: "2023-05-20T08:12:37Z",
      updatedAt: "2023-05-20T08:12:37Z",
      event: {
        name: "Company Gathering",
        date: "2023-05-20",
      },
    },
    {
      id: "6",
      title: "Product Launch",
      image: "/gallery/product-launch.jpg",
      eventId: "event6",
      fileUrl: "/gallery/full/product-launch.jpg",
      mimeType: "image/jpeg",
      fileSize: 2250000,
      createdAt: "2023-06-12T10:35:21Z",
      updatedAt: "2023-06-12T10:35:21Z",
      event: {
        name: "Product Launch",
        date: "2023-06-12",
      },
    },
  ]);

  const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter galleries based on search term and filters
  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch =
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent =
      eventFilter === "all" || gallery.eventId === eventFilter;

    return matchesSearch && matchesEvent;
  });

  // Get unique events for filter
  const events = [...new Set(galleries.map((g) => g.eventId))];

  // Toggle gallery selection
  const toggleGallerySelection = (id: string) => {
    if (selectedGalleries.includes(id)) {
      setSelectedGalleries(
        selectedGalleries.filter((galleryId) => galleryId !== id)
      );
    } else {
      setSelectedGalleries([...selectedGalleries, id]);
    }
  };

  // Select all galleries on current page
  const toggleSelectAll = () => {
    if (selectedGalleries.length === filteredGalleries.length) {
      setSelectedGalleries([]);
    } else {
      setSelectedGalleries(filteredGalleries.map((gallery) => gallery.id));
    }
  };

  // Navigate to add gallery page
  const handleAddGallery = () => {
    router.push("/dashboard/gallery/create");
  };

  // Navigate to edit gallery page
  const handleEditGallery = (id: string) => {
    router.push(`/dashboard/gallery/edit/${id}`);
  };

  // View gallery details
  const handleViewGallery = (id: string) => {
    router.push(`/dashboard/gallery/view/${id}`);
  };

  // Download gallery file
  const handleDownloadFile = (gallery: Gallery) => {
    if (gallery.fileUrl) {
      // In a real application, this would trigger a download
      console.log(`Downloading file: ${gallery.title} from ${gallery.fileUrl}`);
    }
  };

  // Delete gallery(s)
  const handleDelete = (gallery?: Gallery) => {
    if (gallery) {
      setCurrentGallery(gallery);
    }
    setShowDeleteModal(true);
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentGallery) {
      // Delete single gallery
      setGalleries(
        galleries.filter((gallery) => gallery.id !== currentGallery.id)
      );
    } else if (selectedGalleries.length > 0) {
      // Delete multiple galleries
      setGalleries(
        galleries.filter((gallery) => !selectedGalleries.includes(gallery.id))
      );
      setSelectedGalleries([]);
    }
    setShowDeleteModal(false);
    setCurrentGallery(null);
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
          <p className="text-gray-600 mt-1">
            Kelola semua foto dan gambar galeri organisasi
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddGallery}
        >
          <FiPlus className="mr-2" />
          Tambah Foto
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Foto</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiImage className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {galleries.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Jumlah Acara</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCalendar className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {events.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Rata-rata Ukuran
            </h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiFolder className="text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatFileSize(
              galleries.reduce((sum, g) => sum + (g.fileSize || 0), 0) /
                galleries.length
            )}
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
              placeholder="Cari foto berdasarkan judul atau nama acara..."
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
              title="Tampilan Grid"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
              title="Tampilan List"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
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
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acara
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">Semua Acara</option>
                {events.map((eventId) => {
                  const event = galleries.find(
                    (g) => g.eventId === eventId
                  )?.event;
                  return (
                    <option key={eventId} value={eventId}>
                      {event?.name || eventId}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedGalleries.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedGalleries.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Hapus Terpilih ({selectedGalleries.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Content */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
          {filteredGalleries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <FiImage size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                Tidak ada foto ditemukan
              </p>
              <p className="text-gray-400 mt-1">
                Coba sesuaikan pencarian atau filter Anda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative group">
                    <img
                      src={gallery.image}
                      alt={gallery.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => handleViewGallery(gallery.id)}
                          title="Lihat detail"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => handleEditGallery(gallery.id)}
                          title="Edit foto"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(gallery)}
                          title="Hapus foto"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedGalleries.includes(gallery.id)}
                      onChange={() => toggleGallerySelection(gallery.id)}
                      className="absolute top-2 left-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {gallery.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {gallery.event.name}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{formatFileSize(gallery.fileSize)}</span>
                      <span>{formatDate(gallery.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* List View */
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
                        filteredGalleries.length > 0 &&
                        selectedGalleries.length === filteredGalleries.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Foto
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Judul
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acara
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ukuran
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dibuat
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
                {filteredGalleries.map((gallery) => (
                  <tr
                    key={gallery.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedGalleries.includes(gallery.id)}
                        onChange={() => toggleGallerySelection(gallery.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <img
                        src={gallery.image}
                        alt={gallery.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {gallery.title}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {gallery.event.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(gallery.event.date)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatFileSize(gallery.fileSize)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(gallery.createdAt)}
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => handleViewGallery(gallery.id)}
                          title="Lihat detail"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => handleEditGallery(gallery.id)}
                          title="Edit foto"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => handleDownloadFile(gallery)}
                          title="Download foto"
                        >
                          <FiDownload size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(gallery)}
                          title="Hapus foto"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGalleries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <FiImage size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                Tidak ada foto ditemukan
              </p>
              <p className="text-gray-400 mt-1">
                Coba sesuaikan pencarian atau filter Anda
              </p>
            </div>
          )}
        </div>
      )}

      {/* Table Footer for List View */}
      {viewMode === "list" && filteredGalleries.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-700 mb-4 sm:mb-0">
            Menampilkan{" "}
            <span className="font-medium">{filteredGalleries.length}</span> dari{" "}
            <span className="font-medium">{galleries.length}</span> foto
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
                    setCurrentGallery(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentGallery
                  ? `Apakah Anda yakin ingin menghapus foto "${currentGallery.title}"? Tindakan ini tidak dapat dibatalkan.`
                  : `Apakah Anda yakin ingin menghapus ${selectedGalleries.length} foto terpilih? Tindakan ini tidak dapat dibatalkan.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentGallery(null);
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
