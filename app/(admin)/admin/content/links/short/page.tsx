"use client";

export default function AddDocumentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Add Document</h1>
      <p className="text-gray-600 mt-1">This page is under development.</p>
    </div>
  );
}

// // app/dashboard/links/page.tsx
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
//   FiLink,
//   FiX,
//   FiChevronDown,
//   FiCheckCircle,
//   FiUser,
//   FiLayout,
//   FiExternalLink,
//   FiCopy,
// } from "react-icons/fi";

// interface LinkHub {
//   id: string;
//   userId: string;
//   username: string | null;
//   themeId: string | null;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
//   user: {
//     name: string;
//     email: string;
//   };
//   theme?: {
//     name: string;
//   };
//   details: LinkHubDetail[];
// }

// interface LinkHubDetail {
//   id: string;
//   linkHubId: string;
//   title: string;
//   shortLink: string | null;
//   url: string;
//   thumbnail: string | null;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
// }

// interface LinkHubTheme {
//   id: string;
//   name: string;
//   userId: string;
//   data: string | null;
//   isActive: boolean;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
//   user: {
//     name: string;
//     email: string;
//   };
// }

// interface ShortLink {
//   id: string;
//   title: string;
//   shortName: string;
//   url: string;
//   userId: string;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
//   user: {
//     name: string;
//     email: string;
//   };
// }

// export default function LinksPage() {
//   const router = useRouter();

//   // Sample data
//   const [linkHubs, setLinkHubs] = useState<LinkHub[]>([
//     {
//       id: "1",
//       userId: "user1",
//       username: "johndoe",
//       themeId: "theme1",
//       status: "APPROVED",
//       createdAt: "2023-10-15T09:32:45Z",
//       updatedAt: "2023-10-18T14:20:12Z",
//       user: {
//         name: "John Doe",
//         email: "john.doe@organization.org",
//       },
//       theme: {
//         name: "Modern Blue",
//       },
//       details: [
//         {
//           id: "1-1",
//           linkHubId: "1",
//           title: "Portfolio Website",
//           shortLink: "johndoe-portfolio",
//           url: "https://johndoe.com",
//           thumbnail: "/thumbnails/portfolio.jpg",
//           status: "APPROVED",
//           createdAt: "2023-10-15T09:32:45Z",
//           updatedAt: "2023-10-15T09:32:45Z",
//         },
//         {
//           id: "1-2",
//           linkHubId: "1",
//           title: "LinkedIn Profile",
//           shortLink: "johndoe-linkedin",
//           url: "https://linkedin.com/in/johndoe",
//           thumbnail: null,
//           status: "APPROVED",
//           createdAt: "2023-10-16T11:20:30Z",
//           updatedAt: "2023-10-16T11:20:30Z",
//         },
//       ],
//     },
//     {
//       id: "2",
//       userId: "user2",
//       username: "alicesmith",
//       themeId: "theme2",
//       status: "PENDING",
//       createdAt: "2023-10-18T14:20:12Z",
//       updatedAt: "2023-10-18T14:20:12Z",
//       user: {
//         name: "Alice Smith",
//         email: "alice.smith@organization.org",
//       },
//       theme: {
//         name: "Minimalist",
//       },
//       details: [
//         {
//           id: "2-1",
//           linkHubId: "2",
//           title: "GitHub Repository",
//           shortLink: "alice-github",
//           url: "https://github.com/alicesmith",
//           thumbnail: null,
//           status: "PENDING",
//           createdAt: "2023-10-18T14:20:12Z",
//           updatedAt: "2023-10-18T14:20:12Z",
//         },
//       ],
//     },
//   ]);

//   const [themes, setThemes] = useState<LinkHubTheme[]>([
//     {
//       id: "theme1",
//       name: "Modern Blue",
//       userId: "user3",
//       data: '{"primaryColor":"#3B82F6","backgroundColor":"#FFFFFF"}',
//       isActive: true,
//       status: "APPROVED",
//       createdAt: "2023-10-10T08:15:22Z",
//       updatedAt: "2023-10-10T08:15:22Z",
//       user: {
//         name: "Robert Johnson",
//         email: "robert.j@organization.org",
//       },
//     },
//     {
//       id: "theme2",
//       name: "Minimalist",
//       userId: "user4",
//       data: '{"primaryColor":"#000000","backgroundColor":"#F9FAFB"}',
//       isActive: false,
//       status: "PENDING",
//       createdAt: "2023-10-12T13:42:18Z",
//       updatedAt: "2023-10-12T13:42:18Z",
//       user: {
//         name: "Emily Wilson",
//         email: "emily.wilson@organization.org",
//       },
//     },
//   ]);

//   const [shortLinks, setShortLinks] = useState<ShortLink[]>([
//     {
//       id: "sl1",
//       title: "Company Website",
//       shortName: "company",
//       url: "https://company.com",
//       userId: "user1",
//       status: "APPROVED",
//       createdAt: "2023-10-05T11:45:23Z",
//       updatedAt: "2023-10-05T11:45:23Z",
//       user: {
//         name: "John Doe",
//         email: "john.doe@organization.org",
//       },
//     },
//     {
//       id: "sl2",
//       title: "Event Registration",
//       shortName: "event-reg",
//       url: "https://company.com/events/register",
//       userId: "user2",
//       status: "PENDING",
//       createdAt: "2023-10-19T08:12:37Z",
//       updatedAt: "2023-10-19T08:12:37Z",
//       user: {
//         name: "Alice Smith",
//         email: "alice.smith@organization.org",
//       },
//     },
//   ]);

//   const [activeTab, setActiveTab] = useState<"hubs" | "themes" | "shortlinks">(
//     "hubs"
//   );
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentItem, setCurrentItem] = useState<{
//     type: string;
//     id: string;
//     name: string;
//   } | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // Filter items based on active tab, search term and filters
//   const filteredItems = {
//     hubs: linkHubs.filter((hub) => {
//       const matchesSearch =
//         hub.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         hub.user.name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus =
//         statusFilter === "all" || hub.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     }),
//     themes: themes.filter((theme) => {
//       const matchesSearch =
//         theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         theme.user.name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus =
//         statusFilter === "all" || theme.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     }),
//     shortlinks: shortLinks.filter((sl) => {
//       const matchesSearch =
//         sl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sl.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sl.user.name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus =
//         statusFilter === "all" || sl.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     }),
//   };

//   // Toggle item selection
//   const toggleItemSelection = (id: string) => {
//     if (selectedItems.includes(id)) {
//       setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
//     } else {
//       setSelectedItems([...selectedItems, id]);
//     }
//   };

//   // Select all items on current page
//   const toggleSelectAll = () => {
//     const currentItems = filteredItems[activeTab].map((item: any) => item.id);
//     if (selectedItems.length === currentItems.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(currentItems);
//     }
//   };

//   // Navigate to add item page
//   const handleAddItem = () => {
//     switch (activeTab) {
//       case "hubs":
//         router.push("/dashboard/links/hubs/create");
//         break;
//       case "themes":
//         router.push("/dashboard/links/themes/create");
//         break;
//       case "shortlinks":
//         router.push("/dashboard/links/shortlinks/create");
//         break;
//     }
//   };

//   // Navigate to edit item page
//   const handleEditItem = (id: string) => {
//     switch (activeTab) {
//       case "hubs":
//         router.push(`/dashboard/links/hubs/edit/${id}`);
//         break;
//       case "themes":
//         router.push(`/dashboard/links/themes/edit/${id}`);
//         break;
//       case "shortlinks":
//         router.push(`/dashboard/links/shortlinks/edit/${id}`);
//         break;
//     }
//   };

//   // View item details
//   const handleViewItem = (id: string) => {
//     switch (activeTab) {
//       case "hubs":
//         router.push(`/dashboard/links/hubs/view/${id}`);
//         break;
//       case "themes":
//         router.push(`/dashboard/links/themes/view/${id}`);
//         break;
//       case "shortlinks":
//         router.push(`/dashboard/links/shortlinks/view/${id}`);
//         break;
//     }
//   };

//   // Delete item(s)
//   const handleDelete = (item?: any) => {
//     if (item) {
//       let itemName = "";
//       switch (activeTab) {
//         case "hubs":
//           itemName = item.username || `Link Hub by ${item.user.name}`;
//           break;
//         case "themes":
//           itemName = item.name;
//           break;
//         case "shortlinks":
//           itemName = item.title;
//           break;
//       }
//       setCurrentItem({ type: activeTab, id: item.id, name: itemName });
//     }
//     setShowDeleteModal(true);
//   };

//   // Toggle theme active status
//   const handleToggleThemeActive = (id: string) => {
//     setThemes(
//       themes.map(
//         (theme) =>
//           theme.id === id
//             ? { ...theme, isActive: !theme.isActive }
//             : { ...theme, isActive: false } // Deactivate others
//       )
//     );
//   };

//   // Copy short link to clipboard
//   const handleCopyShortLink = (shortName: string) => {
//     const shortLink = `${window.location.origin}/s/${shortName}`;
//     navigator.clipboard.writeText(shortLink);
//     // You might want to show a toast notification here
//   };

//   // Execute deletion
//   const confirmDelete = () => {
//     if (currentItem) {
//       // Delete single item
//       switch (currentItem.type) {
//         case "hubs":
//           setLinkHubs(linkHubs.filter((hub) => hub.id !== currentItem.id));
//           break;
//         case "themes":
//           setThemes(themes.filter((theme) => theme.id !== currentItem.id));
//           break;
//         case "shortlinks":
//           setShortLinks(shortLinks.filter((sl) => sl.id !== currentItem.id));
//           break;
//       }
//     } else if (selectedItems.length > 0) {
//       // Delete multiple items
//       switch (activeTab) {
//         case "hubs":
//           setLinkHubs(
//             linkHubs.filter((hub) => !selectedItems.includes(hub.id))
//           );
//           break;
//         case "themes":
//           setThemes(
//             themes.filter((theme) => !selectedItems.includes(theme.id))
//           );
//           break;
//         case "shortlinks":
//           setShortLinks(
//             shortLinks.filter((sl) => !selectedItems.includes(sl.id))
//           );
//           break;
//       }
//       setSelectedItems([]);
//     }
//     setShowDeleteModal(false);
//     setCurrentItem(null);
//   };

//   // Get status badge class
//   const getStatusClass = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "APPROVED":
//         return "bg-green-100 text-green-800";
//       case "REJECTED":
//         return "bg-red-100 text-red-800";
//       case "ARCHIVED":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
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

//   // Get active tab data
//   const getActiveTabData = () => {
//     switch (activeTab) {
//       case "hubs":
//         return {
//           title: "Link Hubs",
//           count: linkHubs.length,
//           icon: <FiLink className="mr-2" />,
//         };
//       case "themes":
//         return {
//           title: "Themes",
//           count: themes.length,
//           icon: <FiLayout className="mr-2" />,
//         };
//       case "shortlinks":
//         return {
//           title: "Short Links",
//           count: shortLinks.length,
//           icon: <FiExternalLink className="mr-2" />,
//         };
//       default:
//         return {
//           title: "Link Hubs",
//           count: linkHubs.length,
//           icon: <FiLink className="mr-2" />,
//         };
//     }
//   };

//   const activeTabData = getActiveTabData();

//   return (
//     <div className="p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Manajemen Link</h1>
//           <p className="text-gray-600 mt-1">
//             Kelola semua link hubs, themes, dan short links
//           </p>
//         </div>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
//           onClick={handleAddItem}
//         >
//           <FiPlus className="mr-2" />
//           Tambah {activeTabData.title}
//         </button>
//       </div>

//       {/* Tab Navigation */}
//       <div className="bg-white rounded-xl shadow-sm p-2 mb-6 border border-gray-100">
//         <div className="flex">
//           <button
//             className={`flex-1 py-2 px-4 text-center rounded-lg transition-colors ${
//               activeTab === "hubs"
//                 ? "bg-blue-100 text-blue-700"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//             onClick={() => setActiveTab("hubs")}
//           >
//             <div className="flex items-center justify-center">
//               <FiLink className="mr-2" />
//               Link Hubs
//               <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
//                 {linkHubs.length}
//               </span>
//             </div>
//           </button>
//           <button
//             className={`flex-1 py-2 px-4 text-center rounded-lg transition-colors ${
//               activeTab === "themes"
//                 ? "bg-blue-100 text-blue-700"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//             onClick={() => setActiveTab("themes")}
//           >
//             <div className="flex items-center justify-center">
//               <FiLayout className="mr-2" />
//               Themes
//               <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
//                 {themes.length}
//               </span>
//             </div>
//           </button>
//           <button
//             className={`flex-1 py-2 px-4 text-center rounded-lg transition-colors ${
//               activeTab === "shortlinks"
//                 ? "bg-blue-100 text-blue-700"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//             onClick={() => setActiveTab("shortlinks")}
//           >
//             <div className="flex items-center justify-center">
//               <FiExternalLink className="mr-2" />
//               Short Links
//               <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
//                 {shortLinks.length}
//               </span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Link Hubs
//             </h3>
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <FiLink className="text-blue-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {linkHubs.length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Total Themes</h3>
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <FiLayout className="text-purple-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {themes.length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Short Links
//             </h3>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FiExternalLink className="text-green-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {shortLinks.length}
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
//               placeholder={`Cari ${activeTabData.title.toLowerCase()}...`}
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
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
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
//                 <option value="PENDING">Menunggu</option>
//                 <option value="APPROVED">Disetujui</option>
//                 <option value="REJECTED">Ditolak</option>
//                 <option value="ARCHIVED">Diarsipkan</option>
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
//                   selectedItems.length === 0
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-red-50 text-red-700 hover:bg-red-100"
//                 }`}
//                 onClick={() => handleDelete()}
//                 disabled={selectedItems.length === 0}
//               >
//                 <FiTrash2 className="mr-2" />
//                 Hapus Terpilih ({selectedItems.length})
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Items Table */}
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
//                       filteredItems[activeTab].length > 0 &&
//                       selectedItems.length === filteredItems[activeTab].length
//                     }
//                     onChange={toggleSelectAll}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                   />
//                 </th>
//                 {activeTab === "hubs" && (
//                   <>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Username
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Pemilik
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Theme
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Jumlah Link
//                     </th>
//                   </>
//                 )}
//                 {activeTab === "themes" && (
//                   <>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Nama Theme
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Pembuat
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Status
//                     </th>
//                   </>
//                 )}
//                 {activeTab === "shortlinks" && (
//                   <>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Judul
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Short Link
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       URL Tujuan
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Pembuat
//                     </th>
//                   </>
//                 )}
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
//               {filteredItems[activeTab].length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={
//                       activeTab === "hubs" ? 8 : activeTab === "themes" ? 6 : 7
//                     }
//                     className="px-6 py-8 text-center"
//                   >
//                     <div className="text-gray-400 mb-2">
//                       {activeTab === "hubs" ? (
//                         <FiLink size={48} className="mx-auto" />
//                       ) : activeTab === "themes" ? (
//                         <FiLayout size={48} className="mx-auto" />
//                       ) : (
//                         <FiExternalLink size={48} className="mx-auto" />
//                       )}
//                     </div>
//                     <p className="text-gray-500 text-lg font-medium">
//                       Tidak ada data ditemukan
//                     </p>
//                     <p className="text-gray-400 mt-1">
//                       Coba sesuaikan pencarian atau filter Anda
//                     </p>
//                   </td>
//                 </tr>
//               )}

//               {activeTab === "hubs" &&
//                 filteredItems.hubs.map((hub) => (
//                   <tr
//                     key={hub.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedItems.includes(hub.id)}
//                         onChange={() => toggleItemSelection(hub.id)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                       />
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {hub.username || "-"}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="p-1 bg-gray-100 rounded-full mr-2">
//                           <FiUser className="text-gray-500" size={14} />
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-900">
//                             {hub.user.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {hub.user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {hub.theme?.name || "Default"}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {hub.details.length} link
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
//                           hub.status
//                         )}`}
//                       >
//                         {hub.status === "PENDING"
//                           ? "Menunggu"
//                           : hub.status === "APPROVED"
//                           ? "Disetujui"
//                           : hub.status === "REJECTED"
//                           ? "Ditolak"
//                           : "Diarsipkan"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(hub.createdAt)}
//                     </td>
//                     <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                           onClick={() => handleViewItem(hub.id)}
//                           title="Lihat detail"
//                         >
//                           <FiEye size={16} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                           onClick={() => handleEditItem(hub.id)}
//                           title="Edit hub"
//                         >
//                           <FiEdit size={16} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                           onClick={() => handleDelete(hub)}
//                           title="Hapus hub"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//               {activeTab === "themes" &&
//                 filteredItems.themes.map((theme) => (
//                   <tr
//                     key={theme.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedItems.includes(theme.id)}
//                         onChange={() => toggleItemSelection(theme.id)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {theme.name}
//                         {theme.isActive && (
//                           <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
//                             Aktif
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="p-1 bg-gray-100 rounded-full mr-2">
//                           <FiUser className="text-gray-500" size={14} />
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-900">
//                             {theme.user.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {theme.user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
//                           theme.status
//                         )}`}
//                       >
//                         {theme.status === "PENDING"
//                           ? "Menunggu"
//                           : theme.status === "APPROVED"
//                           ? "Disetujui"
//                           : theme.status === "REJECTED"
//                           ? "Ditolak"
//                           : "Diarsipkan"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(theme.createdAt)}
//                     </td>
//                     <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                           onClick={() => handleViewItem(theme.id)}
//                           title="Lihat detail"
//                         >
//                           <FiEye size={16} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                           onClick={() => handleEditItem(theme.id)}
//                           title="Edit theme"
//                         >
//                           <FiEdit size={16} />
//                         </button>
//                         {!theme.isActive && (
//                           <button
//                             className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
//                             onClick={() => handleToggleThemeActive(theme.id)}
//                             title="Aktifkan theme"
//                           >
//                             <FiCheckCircle size={16} />
//                           </button>
//                         )}
//                         <button
//                           className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                           onClick={() => handleDelete(theme)}
//                           title="Hapus theme"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//               {activeTab === "shortlinks" &&
//                 filteredItems.shortlinks.map((sl) => (
//                   <tr
//                     key={sl.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedItems.includes(sl.id)}
//                         onChange={() => toggleItemSelection(sl.id)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {sl.title}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="text-sm text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
//                           /s/{sl.shortName}
//                         </span>
//                         <button
//                           className="p-1 ml-2 text-gray-500 hover:text-gray-700"
//                           onClick={() => handleCopyShortLink(sl.shortName)}
//                           title="Salin link"
//                         >
//                           <FiCopy size={14} />
//                         </button>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="text-sm text-gray-600 truncate max-w-xs">
//                         {sl.url}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="p-1 bg-gray-100 rounded-full mr-2">
//                           <FiUser className="text-gray-500" size={14} />
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-900">
//                             {sl.user.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {sl.user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
//                           sl.status
//                         )}`}
//                       >
//                         {sl.status === "PENDING"
//                           ? "Menunggu"
//                           : sl.status === "APPROVED"
//                           ? "Disetujui"
//                           : sl.status === "REJECTED"
//                           ? "Ditolak"
//                           : "Diarsipkan"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(sl.createdAt)}
//                     </td>
//                     <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                           onClick={() => window.open(sl.url, "_blank")}
//                           title="Buka URL"
//                         >
//                           <FiExternalLink size={16} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                           onClick={() => handleEditItem(sl.id)}
//                           title="Edit short link"
//                         >
//                           <FiEdit size={16} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                           onClick={() => handleDelete(sl)}
//                           title="Hapus short link"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Table Footer */}
//         {filteredItems[activeTab].length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
//             <p className="text-sm text-gray-700 mb-4 sm:mb-0">
//               Menampilkan{" "}
//               <span className="font-medium">
//                 {filteredItems[activeTab].length}
//               </span>{" "}
//               dari{" "}
//               <span className="font-medium">
//                 {activeTab === "hubs"
//                   ? linkHubs.length
//                   : activeTab === "themes"
//                   ? themes.length
//                   : shortLinks.length}
//               </span>{" "}
//               {activeTabData.title.toLowerCase()}
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
//                     setCurrentItem(null);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600">
//                 {currentItem
//                   ? `Apakah Anda yakin ingin menghapus ${
//                       activeTab === "hubs"
//                         ? "link hub"
//                         : activeTab === "themes"
//                         ? "theme"
//                         : "short link"
//                     } "${
//                       currentItem.name
//                     }"? Tindakan ini tidak dapat dibatalkan.`
//                   : `Apakah Anda yakin ingin menghapus ${
//                       selectedItems.length
//                     } ${
//                       activeTab === "hubs"
//                         ? "link hub"
//                         : activeTab === "themes"
//                         ? "theme"
//                         : "short link"
//                     } terpilih? Tindakan ini tidak dapat dibatalkan.`}
//               </p>
//             </div>
//             <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setCurrentItem(null);
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
