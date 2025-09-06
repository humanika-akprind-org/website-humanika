"use client";

export default function AddDocumentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Add Document</h1>
      <p className="text-gray-600 mt-1">This page is under development.</p>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FiSearch,
//   FiPlus,
//   FiFilter,
//   FiEdit,
//   FiTrash2,
//   FiEye,
//   FiDownload,
//   FiX,
//   FiChevronDown,
//   FiImage,
//   FiVideo,
//   FiFile,
//   FiExternalLink,
// } from "react-icons/fi";

// interface Gallery {
//   id: string;
//   title: string;
//   image: string;
//   eventId: string;
//   fileUrl?: string;
//   mimeType?: string;
//   fileSize?: number;
//   createdAt: string;
//   updatedAt: string;
//   // Relations
//   event: {
//     id: string;
//     name: string;
//   };
// }

// export default function GalleryManagementPage() {
//   const router = useRouter();
//   const [galleries, setGalleries] = useState<Gallery[]>([
//     {
//       id: "1",
//       title: "Pembukaan Webinar Teknologi",
//       image: "/images/gallery/webinar-opening.jpg",
//       eventId: "event1",
//       fileUrl: "/files/gallery/webinar-opening.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 2048576,
//       createdAt: "2023-05-15T10:30:45Z",
//       updatedAt: "2023-05-15T10:30:45Z",
//       event: {
//         id: "event1",
//         name: "Webinar Teknologi Terkini",
//       },
//     },
//     {
//       id: "2",
//       title: "Sesi Diskusi Panel",
//       image: "/images/gallery/panel-discussion.jpg",
//       eventId: "event1",
//       fileUrl: "/files/gallery/panel-discussion.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 1859321,
//       createdAt: "2023-05-15T11:45:22Z",
//       updatedAt: "2023-05-15T11:45:22Z",
//       event: {
//         id: "event1",
//         name: "Webinar Teknologi Terkini",
//       },
//     },
//     {
//       id: "3",
//       title: "Peserta Pelatihan Kepemimpinan",
//       image: "/images/gallery/leadership-participants.jpg",
//       eventId: "event2",
//       fileUrl: "/files/gallery/leadership-participants.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 2567890,
//       createdAt: "2023-06-20T14:20:33Z",
//       updatedAt: "2023-06-20T14:20:33Z",
//       event: {
//         id: "event2",
//         name: "Pelatihan Kepemimpinan",
//       },
//     },
//     {
//       id: "4",
//       title: "Video Dokumentasi Research Competition",
//       image: "/images/gallery/research-video-thumb.jpg",
//       eventId: "event3",
//       fileUrl: "/files/gallery/research-competition.mp4",
//       mimeType: "video/mp4",
//       fileSize: 12567890,
//       createdAt: "2023-07-12T16:45:18Z",
//       updatedAt: "2023-07-12T16:45:18Z",
//       event: {
//         id: "event3",
//         name: "Research Competition",
//       },
//     },
//     {
//       id: "5",
//       title: "Stand Bazaar Kewirausahaan",
//       image: "/images/gallery/bazaar-stands.jpg",
//       eventId: "event4",
//       fileUrl: "/files/gallery/bazaar-stands.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 3120456,
//       createdAt: "2023-08-05T09:15:27Z",
//       updatedAt: "2023-08-05T09:15:27Z",
//       event: {
//         id: "event4",
//         name: "Bazaar Kewirausahaan",
//       },
//     },
//     {
//       id: "6",
//       title: "Presentasi Workshop Digital Marketing",
//       image: "/images/gallery/workshop-presentation.jpg",
//       eventId: "event5",
//       fileUrl: "/files/gallery/workshop-presentation.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 2789456,
//       createdAt: "2023-04-22T13:30:55Z",
//       updatedAt: "2023-04-22T13:30:55Z",
//       event: {
//         id: "event5",
//         name: "Workshop Digital Marketing",
//       },
//     },
//     {
//       id: "7",
//       title: "Dokumen Materi Workshop",
//       image: "/images/gallery/workshop-material.jpg",
//       eventId: "event5",
//       fileUrl: "/files/gallery/workshop-material.pdf",
//       mimeType: "application/pdf",
//       fileSize: 512432,
//       createdAt: "2023-04-22T14:45:12Z",
//       updatedAt: "2023-04-22T14:45:12Z",
//       event: {
//         id: "event5",
//         name: "Workshop Digital Marketing",
//       },
//     },
//     {
//       id: "8",
//       title: "Foto Bersama Peserta Webinar",
//       image: "/images/gallery/webinar-group.jpg",
//       eventId: "event1",
//       fileUrl: "/files/gallery/webinar-group.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 3987654,
//       createdAt: "2023-05-15T12:30:10Z",
//       updatedAt: "2023-05-15T12:30:10Z",
//       event: {
//         id: "event1",
//         name: "Webinar Teknologi Terkini",
//       },
//     },
//   ]);

//   const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [eventFilter, setEventFilter] = useState<string>("all");
//   const [typeFilter, setTypeFilter] = useState<string>("all");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [sortField, setSortField] = useState("createdAt");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   // Get unique events for filter
//   const events = Array.from(new Set(galleries.map((g) => g.event.id)))
//     .map((id) => {
//       const gallery = galleries.find((g) => g.event.id === id);
//       return gallery?.event;
//     })
//     .filter(Boolean) as { id: string; name: string }[];

//   // Filter galleries based on search term and filters
//   const filteredGalleries = galleries.filter((gallery) => {
//     const matchesSearch =
//       gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       gallery.event.name.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesEvent =
//       eventFilter === "all" || gallery.event.id === eventFilter;

//     let matchesType = true;
//     if (typeFilter !== "all") {
//       if (typeFilter === "image") {
//         matchesType = gallery.mimeType?.startsWith("image/") || false;
//       } else if (typeFilter === "video") {
//         matchesType = gallery.mimeType?.startsWith("video/") || false;
//       } else if (typeFilter === "document") {
//         matchesType =
//           (!gallery.mimeType?.startsWith("image/") &&
//             !gallery.mimeType?.startsWith("video/")) ||
//           false;
//       }
//     }

//     return matchesSearch && matchesEvent && matchesType;
//   });

//   // Sort galleries
//   const sortedGalleries = [...filteredGalleries].sort((a, b) => {
//     let aValue, bValue;

//     switch (sortField) {
//       case "title":
//         aValue = a.title;
//         bValue = b.title;
//         break;
//       case "event":
//         aValue = a.event.name;
//         bValue = b.event.name;
//         break;
//       case "createdAt":
//         aValue = a.createdAt;
//         bValue = b.createdAt;
//         break;
//       case "fileSize":
//         aValue = a.fileSize || 0;
//         bValue = b.fileSize || 0;
//         break;
//       default:
//         aValue = a.createdAt;
//         bValue = b.createdAt;
//     }

//     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });

//   // Toggle gallery selection
//   const toggleGallerySelection = (id: string) => {
//     if (selectedGalleries.includes(id)) {
//       setSelectedGalleries(
//         selectedGalleries.filter((galleryId) => galleryId !== id)
//       );
//     } else {
//       setSelectedGalleries([...selectedGalleries, id]);
//     }
//   };

//   // Select all galleries on current page
//   const toggleSelectAll = () => {
//     if (selectedGalleries.length === filteredGalleries.length) {
//       setSelectedGalleries([]);
//     } else {
//       setSelectedGalleries(filteredGalleries.map((gallery) => gallery.id));
//     }
//   };

//   // Handle sort
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   // Navigate to add gallery page
//   const handleAddGallery = () => {
//     router.push("/dashboard/gallery/create");
//   };

//   // Navigate to edit gallery page
//   const handleEditGallery = (id: string) => {
//     router.push(`/dashboard/gallery/edit/${id}`);
//   };

//   // View gallery details
//   const handleViewGallery = (id: string) => {
//     router.push(`/dashboard/gallery/view/${id}`);
//   };

//   // Download gallery file
//   const handleDownloadGallery = (gallery: Gallery) => {
//     if (gallery.fileUrl) {
//       // In a real application, this would trigger a download
//       console.log(
//         `Downloading gallery: ${gallery.title} from ${gallery.fileUrl}`
//       );
//       // You might want to use something like:
//       // window.open(gallery.fileUrl, '_blank');
//     }
//   };

//   // Open gallery file in new tab
//   const handleOpenGallery = (gallery: Gallery) => {
//     if (gallery.fileUrl) {
//       window.open(gallery.fileUrl, "_blank");
//     }
//   };

//   // Delete gallery(s)
//   const handleDelete = (gallery?: Gallery) => {
//     if (gallery) {
//       setCurrentGallery(gallery);
//     }
//     setShowDeleteModal(true);
//   };

//   // Execute deletion
//   const confirmDelete = () => {
//     if (currentGallery) {
//       // Delete single gallery
//       setGalleries(
//         galleries.filter((gallery) => gallery.id !== currentGallery.id)
//       );
//     } else if (selectedGalleries.length > 0) {
//       // Delete multiple galleries
//       setGalleries(
//         galleries.filter((gallery) => !selectedGalleries.includes(gallery.id))
//       );
//       setSelectedGalleries([]);
//     }
//     setShowDeleteModal(false);
//     setCurrentGallery(null);
//   };

//   // Get file type icon
//   const getFileIcon = (mimeType: string | undefined) => {
//     if (!mimeType) return <FiFile className="text-gray-400" />;

//     if (mimeType.startsWith("image/")) return <FiImage className="text-blue-500" />;
//     if (mimeType.startsWith("video/")) return <FiVideo className="text-red-500" />;
//     if (mimeType.includes("pdf")) return <FiFile className="text-red-500" />;
//     if (mimeType.includes("word")) return <FiFile className="text-blue-500" />;
//     if (mimeType.includes("excel")) return <FiFile className="text-green-500" />;

//     return <FiFile className="text-gray-400" />;
//   };

//   // Format file size
//   const formatFileSize = (bytes: number | undefined) => {
//     if (!bytes) return "N/A";
//     if (bytes < 1024) return bytes + " B";
//     if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
//     return (bytes / 1048576).toFixed(1) + " MB";
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("id-ID", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Get sort icon
//   const getSortIcon = (field: string) => {
//     if (sortField !== field) return null;
//     return sortDirection === "asc" ? (
//       <FiChevronDown size={14} className="transform rotate-180" />
//     ) : (
//       <FiChevronDown size={14} />
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Manajemen Gallery
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Kelola semua gallery dan dokumentasi event
//           </p>
//         </div>
//         <div className="flex items-center mt-4 md:mt-0">
//           <div className="flex bg-gray-100 rounded-lg p-1 mr-3">
//             <button
//               className={`p-2 rounded-md ${
//                 viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"
//               }`}
//               onClick={() => setViewMode("grid")}
//               title="Grid View"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
//                 />
//               </svg>
//             </button>
//             <button
//               className={`p-2 rounded-md ${
//                 viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"
//               }`}
//               onClick={() => setViewMode("list")}
//               title="List View"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 10h16M4 14h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
//             onClick={handleAddGallery}
//           >
//             <FiPlus className="mr-2" />
//             Tambah Gallery
//           </button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Total Gallery</h3>
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <FiImage className="text-blue-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {galleries.length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Gambar</h3>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FiImage className="text-green-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {galleries.filter((g) => g.mimeType?.startsWith("image/")).length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Video</h3>
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <FiVideo className="text-purple-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {galleries.filter((g) => g.mimeType?.startsWith("video/")).length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Dokumen</h3>
//             <div className="p-2 bg-yellow-100 rounded-lg">
//               <FiFile className="text-yellow-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {
//               galleries.filter(
//                 (g) =>
//                   !g.mimeType?.startsWith("image/") &&
//                   !g.mimeType?.startsWith("video/")
//               ).length
//             }
//           </p>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//           <div className="relative flex-1">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Cari judul gallery atau event..."
//               className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <button
//             className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//           >
//             <FiFilter className="mr-2 text-gray-500" />
//             Filter
//             <FiChevronDown
//               className={`ml-2 transition-transform ${
//                 isFilterOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>
//         </div>

//         {/* Advanced Filters */}
//         {isFilterOpen && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Event
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={eventFilter}
//                 onChange={(e) => setEventFilter(e.target.value)}
//               >
//                 <option value="all">Semua Event</option>
//                 {events.map((event) => (
//                   <option key={event.id} value={event.id}>
//                     {event.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Tipe File
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 <option value="all">Semua Tipe</option>
//                 <option value="image">Gambar</option>
//                 <option value="video">Video</option>
//                 <option value="document">Dokumen</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Urutkan
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={`${sortField}-${sortDirection}`}
//                 onChange={(e) => {
//                   const [field, direction] = e.target.value.split("-");
//                   setSortField(field);
//                   setSortDirection(direction as "asc" | "desc");
//                 }}
//               >
//                 <option value="createdAt-desc">Terbaru</option>
//                 <option value="createdAt-asc">Terlama</option>
//                 <option value="title-asc">Judul (A-Z)</option>
//                 <option value="title-desc">Judul (Z-A)</option>
//                 <option value="event-asc">Event (A-Z)</option>
//                 <option value="event-desc">Event (Z-A)</option>
//                 <option value="fileSize-desc">Ukuran (Besar-Kecil)</option>
//                 <option value="fileSize-asc">Ukuran (Kecil-Besar)</option>
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
//                   selectedGalleries.length === 0
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-red-50 text-red-700 hover:bg-red-100"
//                 }`}
//                 onClick={() => handleDelete()}
//                 disabled={selectedGalleries.length === 0}
//               >
//                 <FiTrash2 className="mr-2" />
//                 Hapus Terpilih ({selectedGalleries.length})
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Gallery View */}
//       {viewMode === "grid" ? (
//         /* Grid View */
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
//           {sortedGalleries.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {sortedGalleries.map((gallery) => (
//                 <div
//                   key={gallery.id}
//                   className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//                 >
//                   <div className="relative group">
//                     <img
//                       src={gallery.image}
//                       alt={gallery.title}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="absolute top-2 right-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedGalleries.includes(gallery.id)}
//                         onChange={() => toggleGallerySelection(gallery.id)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
//                       />
//                     </div>
//                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
//                       <div className="flex space-x-2">
//                         <button
//                           className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
//                           onClick={() => handleViewGallery(gallery.id)}
//                           title="Lihat detail"
//                         >
//                           <FiEye size={16} />
//                         </button>
//                         <button
//                           className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
//                           onClick={() => handleEditGallery(gallery.id)}
//                           title="Edit gallery"
//                         >
//                           <FiEdit size={16} />
//                         </button>
//                         <button
//                           className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
//                           onClick={() => handleDelete(gallery)}
//                           title="Hapus gallery"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                         {gallery.fileUrl && (
//                           <>
//                             <button
//                               className="p-2 bg-white rounded-full text-green-600 hover:bg-green-50 transition-colors"
//                               onClick={() => handleDownloadGallery(gallery)}
//                               title="Download file"
//                             >
//                               <FiDownload size={16} />
//                             </button>
//                             <button
//                               className="p-2 bg-white rounded-full text-purple-600 hover:bg-purple-50 transition-colors"
//                               onClick={() => handleOpenGallery(gallery)}
//                               title="Buka file"
//                             >
//                               <FiExternalLink size={16} />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
//                       {gallery.title}
//                     </h3>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {gallery.event.name}
//                     </p>
//                     <div className="flex items-center justify-between mt-3">
//                       <div className="flex items-center text-xs text-gray-500">
//                         {getFileIcon(gallery.mimeType)}
//                         <span className="ml-1">
//                           {gallery.mimeType?.split("/")[1]?.toUpperCase()}
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {formatDate(gallery.createdAt)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="text-gray-400 mb-2">
//                 <FiImage size={48} className="mx-auto" />
//               </div>
//               <p className="text-gray-500 text-lg font-medium">
//                 Tidak ada gallery ditemukan
//               </p>
//               <p className="text-gray-400 mt-1">
//                 Coba sesuaikan pencarian atau filter Anda
//               </p>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* List View */
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={
//                         filteredGalleries.length > 0 &&
//                         selectedGalleries.length === filteredGalleries.length
//                       }
//                       onChange={toggleSelectAll}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                     />
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort("title")}
//                   >
//                     <div className="flex items-center">
//                       Judul
//                       {getSortIcon("title")}
//                     </div>
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort("event")}
//                   >
//                     <div className="flex items-center">
//                       Event
//                       {getSortIcon("event")}
//                     </div>
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Tipe
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort("fileSize")}
//                   >
//                     <div className="flex items-center">
//                       Ukuran
//                       {getSortIcon("fileSize")}
//                     </div>
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort("createdAt")}
//                   >
//                     <div className="flex items-center">
//                       Dibuat
//                       {getSortIcon("createdAt")}
//                     </div>
//                   </th>
//                   <th
//                     scope="col"
//                     className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Aksi
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {sortedGalleries.map((gallery) => (
//                   <tr
//                     key={gallery.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedGalleries.includes(gallery.id)}
//                         onChange={() => toggleGallerySelection(gallery.id)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center">
//                         <img
//                           src={gallery.image}
//                           alt={gallery.title}
//                           className="h-10 w-10 rounded-lg object-cover mr-3"
//                         />
//                         <div className="text-sm font-medium text-gray-900">
//                           {gallery.title}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {gallery.event.name}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {getFileIcon(gallery.mimeType)}
//                         <span className="ml-2 text-sm text-gray-500">
//                           {gallery.mimeType
//                             ? gallery.mimeType.split("/")[0]
//                             : "Unknown"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatFileSize(gallery.fileSize)}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(gallery.createdAt)}
//                     </td>
//                     <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                           onClick={() => handleViewGallery(gallery.id)}
//                           title="Lihat detail"
//                         >
//                           <FiEye size={16} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                           onClick={() => handleEditGallery(gallery.id)}
//                           title="Edit gallery"
//                         >
//                           <FiEdit size={16} />
//                         </button>
//                         {gallery.fileUrl && (
//                           <button
//                             className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
//                             onClick={() => handleDownloadGallery(gallery)}
//                             title="Download file"
//                           >
//                             <FiDownload size={16} />
//                           </button>
//                         )}
//                         <button
//                           className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                           onClick={() => handleDelete(gallery)}
//                           title="Hapus gallery"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {sortedGalleries.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 mb-2">
//                 <FiImage size={48} className="mx-auto" />
//               </div>
//               <p className="text-gray-500 text-lg font-medium">
//                 Tidak ada gallery ditemukan
//               </p>
//               <p className="text-gray-400 mt-1">
//                 Coba sesuaikan pencarian atau filter Anda
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Table Footer for List View */}
//       {viewMode === "list" && sortedGalleries.length > 0 && (
//         <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between mt-6 rounded-b-xl">
//           <p className="text-sm text-gray-700 mb-4 sm:mb-0">
//             Menampilkan{" "}
//             <span className="font-medium">{sortedGalleries.length}</span> dari{" "}
//             <span className="font-medium">{galleries.length}</span> gallery
//           </p>
//           <div className="flex space-x-2">
//             <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
//               Sebelumnya
//             </button>
//             <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
//               Selanjutnya
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Konfirmasi Penghapusan
//                 </h2>
//                 <button
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setCurrentGallery(null);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600">
//                 {currentGallery
//                   ? `Apakah Anda yakin ingin menghapus gallery "${currentGallery.title}"? Tindakan ini tidak dapat dibatalkan.`
//                   : `Apakah Anda yakin ingin menghapus ${selectedGalleries.length} gallery terpilih? Tindakan ini tidak dapat dibatalkan.`}
//               </p>
//             </div>
//             <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setCurrentGallery(null);
//                 }}
//               >
//                 Batal
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                 onClick={confirmDelete}
//               >
//                 Hapus
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
