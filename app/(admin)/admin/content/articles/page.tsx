"use client";

export default function DevelopmentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center max-w-md mx-auto">
        <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-500 mb-2">
            Page Not Built Yet
          </h1>
          <p className="text-gray-400">
            This page has not been developed by the engineering team.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-yellow-700 text-sm">
              <span className="font-medium">Development Status:</span> This page
              is on the product roadmap but has not been scheduled for
              implementation.
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-400">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <span className="h-2 w-2 bg-gray-400 rounded-full mr-2" />
            STATUS: NOT STARTED
          </div>
        </div>
      </div>
    </div>
  );
}

// // app/dashboard/articles/page.tsx
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
//   FiClock,
//   FiCheckCircle,
//   FiEyeOff,
//   FiFileText,
//   FiUser,
//   FiTag,
//   FiCalendar,
// } from "react-icons/fi";

// interface Article {
//   id: string;
//   title: string;
//   slug: string;
//   content: string;
//   thumbnail: string | null;
//   authorId: string;
//   categoryId: string;
//   periodId: string | null;
//   isPublished: boolean;
//   publishedAt: string | null;
//   fileUrl: string | null;
//   mimeType: string | null;
//   fileSize: number | null;
//   status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
//   author: {
//     name: string;
//     email: string;
//   };
//   category: {
//     name: string;
//   };
//   period?: {
//     name: string;
//   };
// }

// export default function ArticlesPage() {
//   const router = useRouter();
//   const [articles, setArticles] = useState<Article[]>([
//     {
//       id: "1",
//       title: "Panduan Lengkap Menggunakan Next.js 14",
//       slug: "panduan-lengkap-menggunakan-nextjs-14",
//       content:
//         "Next.js 14 hadir dengan fitur-fitur terbaru yang membuat development lebih mudah...",
//       thumbnail: "/thumbnails/nextjs-guide.jpg",
//       authorId: "user1",
//       categoryId: "cat1",
//       periodId: "period1",
//       isPublished: true,
//       publishedAt: "2023-11-05T09:32:45Z",
//       fileUrl: null,
//       mimeType: null,
//       fileSize: null,
//       status: "APPROVED",
//       createdAt: "2023-11-01T09:32:45Z",
//       updatedAt: "2023-11-05T09:32:45Z",
//       author: {
//         name: "John Doe",
//         email: "john.doe@organization.org",
//       },
//       category: {
//         name: "Teknologi",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "2",
//       title: "Strategi Marketing Digital untuk UMKM",
//       slug: "strategi-marketing-digital-untuk-umkm",
//       content:
//         "UMKM perlu mengadopsi strategi marketing digital untuk bersaing di era modern...",
//       thumbnail: "/thumbnails/marketing-strategy.jpg",
//       authorId: "user2",
//       categoryId: "cat2",
//       periodId: "period1",
//       isPublished: false,
//       publishedAt: null,
//       fileUrl: "/articles/marketing-guide.pdf",
//       mimeType: "application/pdf",
//       fileSize: 2048576,
//       status: "PENDING",
//       createdAt: "2023-11-08T14:20:12Z",
//       updatedAt: "2023-11-08T14:20:12Z",
//       author: {
//         name: "Alice Smith",
//         email: "alice.smith@organization.org",
//       },
//       category: {
//         name: "Marketing",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "3",
//       title: "Tips Mengelola Keuangan Pribadi",
//       slug: "tips-mengelola-keuangan-pribadi",
//       content:
//         "Mengelola keuangan pribadi dengan baik adalah kunci kesuksesan finansial...",
//       thumbnail: "/thumbnails/finance-tips.jpg",
//       authorId: "user3",
//       categoryId: "cat3",
//       periodId: null,
//       isPublished: false,
//       publishedAt: null,
//       fileUrl: null,
//       mimeType: null,
//       fileSize: null,
//       status: "DRAFT",
//       createdAt: "2023-11-10T11:45:23Z",
//       updatedAt: "2023-11-12T13:42:18Z",
//       author: {
//         name: "Robert Johnson",
//         email: "robert.j@organization.org",
//       },
//       category: {
//         name: "Keuangan",
//       },
//     },
//     {
//       id: "4",
//       title: "Tren Desain Web 2023",
//       slug: "tren-desain-web-2023",
//       content:
//         "Tahun 2023 membawa berbagai tren desain web yang menarik untuk diikuti...",
//       thumbnail: "/thumbnails/web-design-trends.jpg",
//       authorId: "user4",
//       categoryId: "cat1",
//       periodId: "period1",
//       isPublished: true,
//       publishedAt: "2023-11-15T16:30:55Z",
//       fileUrl: null,
//       mimeType: null,
//       fileSize: null,
//       status: "APPROVED",
//       createdAt: "2023-11-12T16:30:55Z",
//       updatedAt: "2023-11-15T16:30:55Z",
//       author: {
//         name: "Emily Wilson",
//         email: "emily.wilson@organization.org",
//       },
//       category: {
//         name: "Teknologi",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "5",
//       title: "Cara Membangun Tim yang Solid",
//       slug: "cara-membangun-tim-yang-solid",
//       content:
//         "Membangun tim yang solid membutuhkan pendekatan dan strategi yang tepat...",
//       thumbnail: null,
//       authorId: "user1",
//       categoryId: "cat4",
//       periodId: "period1",
//       isPublished: false,
//       publishedAt: null,
//       fileUrl: "/articles/team-building.docx",
//       mimeType:
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       fileSize: 512432,
//       status: "REJECTED",
//       createdAt: "2023-11-18T08:12:37Z",
//       updatedAt: "2023-11-20T10:35:21Z",
//       author: {
//         name: "John Doe",
//         email: "john.doe@organization.org",
//       },
//       category: {
//         name: "Manajemen",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//   ]);

//   const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [publishFilter, setPublishFilter] = useState("all");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // Filter articles based on search term and filters
//   const filteredArticles = articles.filter((article) => {
//     const matchesSearch =
//       article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       article.content.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all" || article.status === statusFilter;
//     const matchesCategory =
//       categoryFilter === "all" || article.categoryId === categoryFilter;
//     const matchesPublish =
//       publishFilter === "all" ||
//       (publishFilter === "published" && article.isPublished) ||
//       (publishFilter === "unpublished" && !article.isPublished);

//     return matchesSearch && matchesStatus && matchesCategory && matchesPublish;
//   });

//   // Get unique categories for filter
//   const categories = [...new Set(articles.map((a) => a.categoryId))];

//   // Toggle article selection
//   const toggleArticleSelection = (id: string) => {
//     if (selectedArticles.includes(id)) {
//       setSelectedArticles(
//         selectedArticles.filter((articleId) => articleId !== id)
//       );
//     } else {
//       setSelectedArticles([...selectedArticles, id]);
//     }
//   };

//   // Select all articles on current page
//   const toggleSelectAll = () => {
//     if (selectedArticles.length === filteredArticles.length) {
//       setSelectedArticles([]);
//     } else {
//       setSelectedArticles(filteredArticles.map((article) => article.id));
//     }
//   };

//   // Navigate to add article page
//   const handleAddArticle = () => {
//     router.push("/dashboard/articles/create");
//   };

//   // Navigate to edit article page
//   const handleEditArticle = (id: string) => {
//     router.push(`/dashboard/articles/edit/${id}`);
//   };

//   // View article details
//   const handleViewArticle = (id: string) => {
//     router.push(`/dashboard/articles/view/${id}`);
//   };

//   // Download article file
//   const handleDownloadFile = (article: Article) => {
//     if (article.fileUrl) {
//       // In a real application, this would trigger a download
//       console.log(`Downloading file: ${article.title} from ${article.fileUrl}`);
//     }
//   };

//   // Delete article(s)
//   const handleDelete = (article?: Article) => {
//     if (article) {
//       setCurrentArticle(article);
//     }
//     setShowDeleteModal(true);
//   };

//   // Change article status
//   const handleChangeStatus = (articleId: string, status: Article["status"]) => {
//     setArticles(
//       articles.map((article) =>
//         article.id === articleId ? { ...article, status } : article
//       )
//     );
//   };

//   // Toggle publish status
//   const handleTogglePublish = (articleId: string) => {
//     setArticles(
//       articles.map((article) =>
//         article.id === articleId
//           ? {
//               ...article,
//               isPublished: !article.isPublished,
//               publishedAt: !article.isPublished
//                 ? new Date().toISOString()
//                 : null,
//             }
//           : article
//       )
//     );
//   };

//   // Execute deletion
//   const confirmDelete = () => {
//     if (currentArticle) {
//       // Delete single article
//       setArticles(
//         articles.filter((article) => article.id !== currentArticle.id)
//       );
//     } else if (selectedArticles.length > 0) {
//       // Delete multiple articles
//       setArticles(
//         articles.filter((article) => !selectedArticles.includes(article.id))
//       );
//       setSelectedArticles([]);
//     }
//     setShowDeleteModal(false);
//     setCurrentArticle(null);
//   };

//   // Get status badge class
//   const getStatusClass = (status: string) => {
//     switch (status) {
//       case "DRAFT":
//         return "bg-gray-100 text-gray-800";
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "APPROVED":
//         return "bg-green-100 text-green-800";
//       case "REJECTED":
//         return "bg-red-100 text-red-800";
//       case "ARCHIVED":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Format date
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("id-ID", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Get file icon based on mime type
//   const getFileIcon = (mimeType: string | null) => {
//     if (!mimeType) return null;

//     if (mimeType.includes("pdf"))
//       return <FiFileText className="text-red-500" />;
//     if (mimeType.includes("word"))
//       return <FiFileText className="text-blue-500" />;

//     return <FiFileText className="text-gray-400" />;
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Manajemen Artikel
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Kelola semua artikel dan konten organisasi
//           </p>
//         </div>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
//           onClick={handleAddArticle}
//         >
//           <FiPlus className="mr-2" />
//           Buat Artikel
//         </button>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Total Artikel</h3>
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <FiFileText className="text-blue-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {articles.length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Draft</h3>
//             <div className="p-2 bg-gray-100 rounded-lg">
//               <FiFileText className="text-gray-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {articles.filter((a) => a.status === "DRAFT").length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Published</h3>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FiEye className="text-green-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {articles.filter((a) => a.isPublished).length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Menunggu</h3>
//             <div className="p-2 bg-yellow-100 rounded-lg">
//               <FiClock className="text-yellow-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {articles.filter((a) => a.status === "PENDING").length}
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
//               placeholder="Cari artikel berdasarkan judul atau konten..."
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
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">Semua Status</option>
//                 <option value="DRAFT">Draft</option>
//                 <option value="PENDING">Menunggu</option>
//                 <option value="APPROVED">Disetujui</option>
//                 <option value="REJECTED">Ditolak</option>
//                 <option value="ARCHIVED">Diarsipkan</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Kategori
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//               >
//                 <option value="all">Semua Kategori</option>
//                 {categories.map((catId) => {
//                   const category = articles.find(
//                     (a) => a.categoryId === catId
//                   )?.category;
//                   return (
//                     <option key={catId} value={catId}>
//                       {category?.name || catId}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Publikasi
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={publishFilter}
//                 onChange={(e) => setPublishFilter(e.target.value)}
//               >
//                 <option value="all">Semua Status</option>
//                 <option value="published">Published</option>
//                 <option value="unpublished">Unpublished</option>
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Articles Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredArticles.length > 0 &&
//                       selectedArticles.length === filteredArticles.length
//                     }
//                     onChange={toggleSelectAll}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                   />
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Artikel
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Kategori
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Penulis
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Status
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Publikasi
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Dibuat
//                 </th>
//                 <th
//                   scope="col"
//                   className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Aksi
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredArticles.map((article) => (
//                 <tr
//                   key={article.id}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       checked={selectedArticles.includes(article.id)}
//                       onChange={() => toggleArticleSelection(article.id)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                     />
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-start">
//                       {article.thumbnail && (
//                         <img
//                           src={article.thumbnail}
//                           alt={article.title}
//                           className="w-12 h-12 rounded-lg object-cover mr-3"
//                         />
//                       )}
//                       <div className="flex-1">
//                         <div className="text-sm font-medium text-gray-900 line-clamp-2">
//                           {article.title}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {article.slug}
//                         </div>
//                         {article.period && (
//                           <div className="text-xs text-gray-400 mt-1">
//                             Periode: {article.period.name}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       <FiTag className="mr-1" size={12} />
//                       {article.category.name}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="p-1 bg-gray-100 rounded-full mr-2">
//                         <FiUser className="text-gray-500" size={14} />
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-900">
//                           {article.author.name}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {article.author.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
//                         article.status
//                       )}`}
//                     >
//                       {article.status === "DRAFT"
//                         ? "Draft"
//                         : article.status === "PENDING"
//                         ? "Menunggu"
//                         : article.status === "APPROVED"
//                         ? "Disetujui"
//                         : article.status === "REJECTED"
//                         ? "Ditolak"
//                         : "Diarsipkan"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         article.isPublished
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {article.isPublished ? (
//                         <>
//                           <FiEye className="mr-1" size={12} />
//                           Published
//                         </>
//                       ) : (
//                         <>
//                           <FiEyeOff className="mr-1" size={12} />
//                           Unpublished
//                         </>
//                       )}
//                     </span>
//                     {article.publishedAt && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         {formatDate(article.publishedAt)}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <FiCalendar className="mr-1 text-gray-400" size={14} />
//                       {formatDate(article.createdAt)}
//                     </div>
//                   </td>
//                   <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-2">
//                       {article.fileUrl && (
//                         <button
//                           className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
//                           onClick={() => handleDownloadFile(article)}
//                           title="Download file"
//                         >
//                           <FiDownload size={16} />
//                         </button>
//                       )}
//                       <button
//                         className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                         onClick={() => handleViewArticle(article.id)}
//                         title="Lihat artikel"
//                       >
//                         <FiEye size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                         onClick={() => handleEditArticle(article.id)}
//                         title="Edit artikel"
//                       >
//                         <FiEdit size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                         onClick={() => handleDelete(article)}
//                         title="Hapus artikel"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
//                         onClick={() => handleTogglePublish(article.id)}
//                         title={article.isPublished ? "Unpublish" : "Publish"}
//                       >
//                         {article.isPublished ? (
//                           <FiEyeOff size={16} />
//                         ) : (
//                           <FiEye size={16} />
//                         )}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredArticles.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-2">
//               <FiFileText size={48} className="mx-auto" />
//             </div>
//             <p className="text-gray-500 text-lg font-medium">
//               Tidak ada artikel ditemukan
//             </p>
//             <p className="text-gray-400 mt-1">
//               Coba sesuaikan pencarian atau filter Anda
//             </p>
//           </div>
//         )}

//         {/* Table Footer */}
//         {filteredArticles.length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
//             <p className="text-sm text-gray-700 mb-4 sm:mb-0">
//               Menampilkan{" "}
//               <span className="font-medium">{filteredArticles.length}</span>{" "}
//               dari <span className="font-medium">{articles.length}</span>{" "}
//               artikel
//             </p>
//             <div className="flex space-x-2">
//               <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
//                 Sebelumnya
//               </button>
//               <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
//                 Selanjutnya
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

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
//                     setCurrentArticle(null);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600">
//                 {currentArticle
//                   ? `Apakah Anda yakin ingin menghapus artikel "${currentArticle.title}"? Tindakan ini tidak dapat dibatalkan.`
//                   : `Apakah Anda yakin ingin menghapus ${selectedArticles.length} artikel terpilih? Tindakan ini tidak dapat dibatalkan.`}
//               </p>
//             </div>
//             <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setCurrentArticle(null);
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
