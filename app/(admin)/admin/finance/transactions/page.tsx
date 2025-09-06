"use client";

export default function AddDocumentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Add Document</h1>
      <p className="text-gray-600 mt-1">This page is under development.</p>
    </div>
  );
}

// // app/dashboard/finance/page.tsx
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
//   FiAlertCircle,
//   FiArrowUp,
//   FiArrowDown,
//   FiDollarSign,
//   FiFile,
//   FiTrendingUp,
//   FiTrendingDown,
//   FiCalendar,
// } from "react-icons/fi";

// interface Finance {
//   id: string;
//   amount: number;
//   description: string;
//   date: string;
//   categoryId: string;
//   type: "INCOME" | "EXPENSE";
//   periodId: string;
//   eventId: string | null;
//   userId: string;
//   proofFile: string | null;
//   fileUrl: string | null;
//   mimeType: string | null;
//   fileSize: number | null;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
//   category?: {
//     name: string;
//     color: string;
//   };
//   user?: {
//     name: string;
//     email: string;
//   };
//   period?: {
//     name: string;
//   };
//   event?: {
//     name: string;
//   };
// }

// export default function FinancePage() {
//   const router = useRouter();
//   const [finances, setFinances] = useState<Finance[]>([
//     {
//       id: "1",
//       amount: 5000000,
//       description: "Pembayaran Proyek Website",
//       date: "2023-11-05T00:00:00Z",
//       categoryId: "cat1",
//       type: "INCOME",
//       periodId: "period1",
//       eventId: null,
//       userId: "user1",
//       proofFile: "invoice-001.pdf",
//       fileUrl: "/finance/invoice-001.pdf",
//       mimeType: "application/pdf",
//       fileSize: 1024456,
//       status: "APPROVED",
//       createdAt: "2023-11-01T09:32:45Z",
//       updatedAt: "2023-11-02T14:20:12Z",
//       category: {
//         name: "Pendapatan Proyek",
//         color: "bg-green-100 text-green-800",
//       },
//       user: {
//         name: "John Doe",
//         email: "john.doe@organization.org",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "2",
//       amount: 2500000,
//       description: "Pembelian Peralatan Kantor",
//       date: "2023-11-10T00:00:00Z",
//       categoryId: "cat2",
//       type: "EXPENSE",
//       periodId: "period1",
//       eventId: null,
//       userId: "user2",
//       proofFile: "receipt-001.pdf",
//       fileUrl: "/finance/receipt-001.pdf",
//       mimeType: "application/pdf",
//       fileSize: 512432,
//       status: "PENDING",
//       createdAt: "2023-11-08T14:20:12Z",
//       updatedAt: "2023-11-08T14:20:12Z",
//       category: {
//         name: "Peralatan",
//         color: "bg-red-100 text-red-800",
//       },
//       user: {
//         name: "Alice Smith",
//         email: "alice.smith@organization.org",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "3",
//       amount: 10000000,
//       description: "Sponsor Acara Teknologi",
//       date: "2023-11-15T00:00:00Z",
//       categoryId: "cat3",
//       type: "INCOME",
//       periodId: "period1",
//       eventId: "event1",
//       userId: "user3",
//       proofFile: "sponsorship-agreement.pdf",
//       fileUrl: "/finance/sponsorship-agreement.pdf",
//       mimeType: "application/pdf",
//       fileSize: 2048576,
//       status: "APPROVED",
//       createdAt: "2023-11-10T11:45:23Z",
//       updatedAt: "2023-11-12T13:42:18Z",
//       category: {
//         name: "Sponsorship",
//         color: "bg-green-100 text-green-800",
//       },
//       user: {
//         name: "Robert Johnson",
//         email: "robert.j@organization.org",
//       },
//       period: {
//         name: "November 2023",
//       },
//       event: {
//         name: "Tech Conference 2023",
//       },
//     },
//     {
//       id: "4",
//       amount: 3500000,
//       description: "Gaji Karyawan November",
//       date: "2023-11-20T00:00:00Z",
//       categoryId: "cat4",
//       type: "EXPENSE",
//       periodId: "period1",
//       eventId: null,
//       userId: "user4",
//       proofFile: "payroll-nov.pdf",
//       fileUrl: "/finance/payroll-nov.pdf",
//       mimeType: "application/pdf",
//       fileSize: 1536921,
//       status: "APPROVED",
//       createdAt: "2023-11-18T16:30:55Z",
//       updatedAt: "2023-11-19T09:15:22Z",
//       category: {
//         name: "Gaji",
//         color: "bg-red-100 text-red-800",
//       },
//       user: {
//         name: "Emily Wilson",
//         email: "emily.wilson@organization.org",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "5",
//       amount: 750000,
//       description: "Transportasi Meeting Klien",
//       date: "2023-11-25T00:00:00Z",
//       categoryId: "cat5",
//       type: "EXPENSE",
//       periodId: "period1",
//       eventId: null,
//       userId: "user1",
//       proofFile: "transport-receipt.jpg",
//       fileUrl: "/finance/transport-receipt.jpg",
//       mimeType: "image/jpeg",
//       fileSize: 512432,
//       status: "REJECTED",
//       createdAt: "2023-11-23T08:12:37Z",
//       updatedAt: "2023-11-24T10:35:21Z",
//       category: {
//         name: "Transportasi",
//         color: "bg-red-100 text-red-800",
//       },
//       user: {
//         name: "John Doe",
//         email: "john.doe@organization.org",
//       },
//       period: {
//         name: "November 2023",
//       },
//     },
//     {
//       id: "6",
//       amount: 2000000,
//       description: "Penjualan Merchandise",
//       date: "2023-11-28T00:00:00Z",
//       categoryId: "cat6",
//       type: "INCOME",
//       periodId: "period1",
//       eventId: "event1",
//       userId: "user2",
//       proofFile: "merch-sales.pdf",
//       fileUrl: "/finance/merch-sales.pdf",
//       mimeType: "application/pdf",
//       fileSize: 1024456,
//       status: "ARCHIVED",
//       createdAt: "2023-11-26T10:35:21Z",
//       updatedAt: "2023-11-27T14:20:05Z",
//       category: {
//         name: "Penjualan",
//         color: "bg-green-100 text-green-800",
//       },
//       user: {
//         name: "Alice Smith",
//         email: "alice.smith@organization.org",
//       },
//       period: {
//         name: "November 2023",
//       },
//       event: {
//         name: "Tech Conference 2023",
//       },
//     },
//   ]);

//   const [selectedFinances, setSelectedFinances] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [periodFilter, setPeriodFilter] = useState("all");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentFinance, setCurrentFinance] = useState<Finance | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [sortField, setSortField] = useState("date");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

//   // Calculate totals
//   const totalIncome = finances
//     .filter((f) => f.type === "INCOME" && f.status === "APPROVED")
//     .reduce((sum, f) => sum + f.amount, 0);

//   const totalExpense = finances
//     .filter((f) => f.type === "EXPENSE" && f.status === "APPROVED")
//     .reduce((sum, f) => sum + f.amount, 0);

//   const netBalance = totalIncome - totalExpense;

//   // Filter finances based on search term and filters
//   const filteredFinances = finances.filter((finance) => {
//     const matchesSearch =
//       finance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (finance.category?.name
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ??
//         false);
//     const matchesStatus =
//       statusFilter === "all" || finance.status === statusFilter;
//     const matchesType = typeFilter === "all" || finance.type === typeFilter;
//     const matchesCategory =
//       categoryFilter === "all" || finance.categoryId === categoryFilter;
//     const matchesPeriod =
//       periodFilter === "all" || finance.periodId === periodFilter;

//     return (
//       matchesSearch &&
//       matchesStatus &&
//       matchesType &&
//       matchesCategory &&
//       matchesPeriod
//     );
//   });

//   // Sort finances
//   const sortedFinances = [...filteredFinances].sort((a, b) => {
//     let aValue, bValue;

//     switch (sortField) {
//       case "amount":
//         aValue = a.amount;
//         bValue = b.amount;
//         break;
//       case "description":
//         aValue = a.description;
//         bValue = b.description;
//         break;
//       case "date":
//         aValue = a.date;
//         bValue = b.date;
//         break;
//       default:
//         aValue = a.date;
//         bValue = b.date;
//     }

//     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });

//   // Toggle finance selection
//   const toggleFinanceSelection = (id: string) => {
//     if (selectedFinances.includes(id)) {
//       setSelectedFinances(
//         selectedFinances.filter((financeId) => financeId !== id)
//       );
//     } else {
//       setSelectedFinances([...selectedFinances, id]);
//     }
//   };

//   // Select all finances on current page
//   const toggleSelectAll = () => {
//     if (selectedFinances.length === filteredFinances.length) {
//       setSelectedFinances([]);
//     } else {
//       setSelectedFinances(filteredFinances.map((finance) => finance.id));
//     }
//   };

//   // Handle sort
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("desc");
//     }
//   };

//   // Navigate to add finance page
//   const handleAddFinance = () => {
//     router.push("/dashboard/finance/create");
//   };

//   // Navigate to edit finance page
//   const handleEditFinance = (id: string) => {
//     router.push(`/dashboard/finance/edit/${id}`);
//   };

//   // View finance details
//   const handleViewFinance = (id: string) => {
//     router.push(`/dashboard/finance/view/${id}`);
//   };

//   // Download finance file
//   const handleDownloadFile = (finance: Finance) => {
//     if (finance.fileUrl) {
//       // In a real application, this would trigger a download
//       console.log(
//         `Downloading file: ${finance.description} from ${finance.fileUrl}`
//       );
//       // You might want to use something like:
//       // window.open(finance.fileUrl, '_blank');
//     }
//   };

//   // Delete finance(s)
//   const handleDelete = (finance?: Finance) => {
//     if (finance) {
//       setCurrentFinance(finance);
//     }
//     setShowDeleteModal(true);
//   };

//   // Change finance status
//   const handleChangeStatus = (financeId: string, status: Finance["status"]) => {
//     setFinances(
//       finances.map((finance) =>
//         finance.id === financeId ? { ...finance, status } : finance
//       )
//     );
//   };

//   // Execute deletion
//   const confirmDelete = () => {
//     if (currentFinance) {
//       // Delete single finance
//       setFinances(
//         finances.filter((finance) => finance.id !== currentFinance.id)
//       );
//     } else if (selectedFinances.length > 0) {
//       // Delete multiple finances
//       setFinances(
//         finances.filter((finance) => !selectedFinances.includes(finance.id))
//       );
//       setSelectedFinances([]);
//     }
//     setShowDeleteModal(false);
//     setCurrentFinance(null);
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

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(amount);
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

//   // Get file icon based on mime type
//   const getFileIcon = (mimeType: string | null) => {
//     if (!mimeType) return <FiFile className="text-gray-400" />;

//     if (mimeType.includes("pdf")) return <FiFile className="text-red-500" />;
//     if (mimeType.includes("word")) return <FiFile className="text-blue-500" />;
//     if (mimeType.includes("excel")){
//       return <FiFile className="text-green-500" />;}
//     if (mimeType.includes("image")){
//       return <FiFile className="text-purple-500" />;}

//     return <FiFile className="text-gray-400" />;
//   };

//   // Get sort icon
//   const getSortIcon = (field: string) => {
//     if (sortField !== field) return null;
//     return sortDirection === "asc" ? (
//       <FiArrowUp size={14} />
//     ) : (
//       <FiArrowDown size={14} />
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Manajemen Keuangan
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Kelola semua transaksi keuangan organisasi
//           </p>
//         </div>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
//           onClick={handleAddFinance}
//         >
//           <FiPlus className="mr-2" />
//           Tambah Transaksi
//         </button>
//       </div>

//       {/* Financial Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Pendapatan
//             </h3>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FiTrendingUp className="text-green-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-green-600 mt-2">
//             {formatCurrency(totalIncome)}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Pengeluaran
//             </h3>
//             <div className="p-2 bg-red-100 rounded-lg">
//               <FiTrendingDown className="text-red-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-red-600 mt-2">
//             {formatCurrency(totalExpense)}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Saldo Bersih</h3>
//             <div
//               className={`p-2 rounded-lg ${
//                 netBalance >= 0 ? "bg-green-100" : "bg-red-100"
//               }`}
//             >
//               <FiDollarSign
//                 className={netBalance >= 0 ? "text-green-500" : "text-red-500"}
//               />
//             </div>
//           </div>
//           <p
//             className={`text-2xl font-bold mt-2 ${
//               netBalance >= 0 ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {formatCurrency(netBalance)}
//           </p>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Transaksi
//             </h3>
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <FiDollarSign className="text-blue-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {finances.length}
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
//             {finances.filter((f) => f.status === "PENDING").length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Disetujui</h3>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FiCheckCircle className="text-green-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {finances.filter((f) => f.status === "APPROVED").length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Ditolak</h3>
//             <div className="p-2 bg-red-100 rounded-lg">
//               <FiAlertCircle className="text-red-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {finances.filter((f) => f.status === "REJECTED").length}
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
//               placeholder="Cari transaksi berdasarkan deskripsi atau kategori..."
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
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
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
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Tipe
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 <option value="all">Semua Tipe</option>
//                 <option value="INCOME">Pendapatan</option>
//                 <option value="EXPENSE">Pengeluaran</option>
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
//                   const category = finances.find(
//                     (f) => f.categoryId === catId
//                   )?.category;
//                   return (
//                     <option key={catId} value={catId}>
//                       {category?.name || catId}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
//                   selectedFinances.length === 0
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-red-50 text-red-700 hover:bg-red-100"
//                 }`}
//                 onClick={() => handleDelete()}
//                 disabled={selectedFinances.length === 0}
//               >
//                 <FiTrash2 className="mr-2" />
//                 Hapus Terpilih ({selectedFinances.length})
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Finances Table */}
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
//                       filteredFinances.length > 0 &&
//                       selectedFinances.length === filteredFinances.length
//                     }
//                     onChange={toggleSelectAll}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                   />
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("description")}
//                 >
//                   <div className="flex items-center">
//                     Deskripsi
//                     {getSortIcon("description")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Kategori
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("amount")}
//                 >
//                   <div className="flex items-center">
//                     Jumlah
//                     {getSortIcon("amount")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Tipe
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Bukti
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("date")}
//                 >
//                   <div className="flex items-center">
//                     Tanggal
//                     {getSortIcon("date")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Status
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
//               {sortedFinances.map((finance) => (
//                 <tr
//                   key={finance.id}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       checked={selectedFinances.includes(finance.id)}
//                       onChange={() => toggleFinanceSelection(finance.id)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                     />
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="text-sm font-medium text-gray-900">
//                       {finance.description}
//                     </div>
//                     {finance.event && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         Acara: {finance.event.name}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
//                         finance.category?.color || "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {finance.category?.name || "Tidak ada kategori"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div
//                       className={`text-sm font-medium ${
//                         finance.type === "INCOME"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {formatCurrency(finance.amount)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         finance.type === "INCOME"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {finance.type === "INCOME" ? (
//                         <>
//                           <FiTrendingUp className="mr-1" size={12} />
//                           Pendapatan
//                         </>
//                       ) : (
//                         <>
//                           <FiTrendingDown className="mr-1" size={12} />
//                           Pengeluaran
//                         </>
//                       )}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {finance.fileUrl ? (
//                         <>
//                           {getFileIcon(finance.mimeType)}
//                           <span className="ml-2 text-sm text-gray-600">
//                             {finance.proofFile || "Bukti"}
//                           </span>
//                         </>
//                       ) : (
//                         <span className="text-sm text-gray-400">Tidak ada</span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <FiCalendar className="mr-1 text-gray-400" size={14} />
//                       {formatDate(finance.date)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
//                         finance.status
//                       )}`}
//                     >
//                       {finance.status === "PENDING"
//                         ? "Menunggu"
//                         : finance.status === "APPROVED"
//                         ? "Disetujui"
//                         : finance.status === "REJECTED"
//                         ? "Ditolak"
//                         : "Diarsipkan"}
//                     </span>
//                   </td>
//                   <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-2">
//                       {finance.fileUrl && (
//                         <button
//                           className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
//                           onClick={() => handleDownloadFile(finance)}
//                           title="Download bukti"
//                         >
//                           <FiDownload size={16} />
//                         </button>
//                       )}
//                       <button
//                         className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                         onClick={() => handleViewFinance(finance.id)}
//                         title="Lihat detail"
//                       >
//                         <FiEye size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                         onClick={() => handleEditFinance(finance.id)}
//                         title="Edit transaksi"
//                       >
//                         <FiEdit size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                         onClick={() => handleDelete(finance)}
//                         title="Hapus transaksi"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {sortedFinances.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-2">
//               <FiDollarSign size={48} className="mx-auto" />
//             </div>
//             <p className="text-gray-500 text-lg font-medium">
//               Tidak ada transaksi ditemukan
//             </p>
//             <p className="text-gray-400 mt-1">
//               Coba sesuaikan pencarian atau filter Anda
//             </p>
//           </div>
//         )}

//         {/* Table Footer */}
//         {sortedFinances.length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
//             <p className="text-sm text-gray-700 mb-4 sm:mb-0">
//               Menampilkan{" "}
//               <span className="font-medium">{sortedFinances.length}</span> dari{" "}
//               <span className="font-medium">{finances.length}</span> transaksi
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
//                     setCurrentFinance(null);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600">
//                 {currentFinance
//                   ? `Apakah Anda yakin ingin menghapus transaksi "${currentFinance.description}"? Tindakan ini tidak dapat dibatalkan.`
//                   : `Apakah Anda yakin ingin menghapus ${selectedFinances.length} transaksi terpilih? Tindakan ini tidak dapat dibatalkan.`}
//               </p>
//             </div>
//             <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setCurrentFinance(null);
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
