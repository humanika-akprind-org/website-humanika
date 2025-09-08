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
//   FiDollarSign,
//   FiCalendar,
//   FiUsers,
//   FiFileText,
//   FiArchive,
//   FiAlertCircle,
// } from "react-icons/fi";

// // Enum Department
// enum Department {
//   INFOKOM = "INFOKOM",
//   PSDM = "PSDM",
//   LITBANG = "LITBANG",
//   KWU = "KWU",
// }

// // Enum Status
// enum Status {
//   DRAFT = "DRAFT",
//   PENDING = "PENDING",
//   APPROVED = "APPROVED",
//   REJECTED = "REJECTED",
//   COMPLETED = "COMPLETED",
//   CANCELLED = "CANCELLED",
// }

// interface Event {
//   id: string;
//   name: string;
//   description: string;
//   responsibleId: string;
//   goal: string;
//   department: Department;
//   periodId: string;
//   startDate: string;
//   endDate: string;
//   funds: number;
//   usedFunds: number;
//   remainingFunds: number;
//   thumbnail?: string;
//   status: Status;
//   workProgramId?: string;
//   createdAt: string;
//   updatedAt: string;
//   // Relations
//   period: {
//     id: string;
//     name: string;
//   };
//   responsible: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   workProgram?: {
//     id: string;
//     name: string;
//   };
// }

// export default function EventManagementPage() {
//   const router = useRouter();
//   const [events, setEvents] = useState<Event[]>([
//     {
//       id: "1",
//       name: "Webinar Teknologi Terkini",
//       description: "Webinar tentang perkembangan teknologi terbaru di industri",
//       responsibleId: "user1",
//       goal: "Meningkatkan pengetahuan teknologi anggota",
//       department: Department.INFOKOM,
//       periodId: "period1",
//       startDate: "2023-05-15T09:00:00Z",
//       endDate: "2023-05-15T12:00:00Z",
//       funds: 5000000,
//       usedFunds: 4200000,
//       remainingFunds: 800000,
//       thumbnail: "/images/events/webinar-tech.jpg",
//       status: Status.COMPLETED,
//       workProgramId: "wp1",
//       createdAt: "2023-04-10T08:30:45Z",
//       updatedAt: "2023-05-16T14:20:12Z",
//       period: {
//         id: "period1",
//         name: "Periode 2023-2024",
//       },
//       responsible: {
//         id: "user1",
//         name: "Ahmad Rizki",
//         email: "ahmad.rizki@example.com",
//       },
//       workProgram: {
//         id: "wp1",
//         name: "Program Pengembangan Teknologi",
//       },
//     },
//     {
//       id: "2",
//       name: "Pelatihan Kepemimpinan",
//       description:
//         "Pelatihan untuk meningkatkan kemampuan kepemimpinan anggota",
//       responsibleId: "user2",
//       goal: "Membangun karakter kepemimpinan",
//       department: Department.PSDM,
//       periodId: "period1",
//       startDate: "2023-06-20T13:00:00Z",
//       endDate: "2023-06-22T16:00:00Z",
//       funds: 7500000,
//       usedFunds: 6000000,
//       remainingFunds: 1500000,
//       thumbnail: "/images/events/leadership-training.jpg",
//       status: Status.APPROVED,
//       workProgramId: "wp2",
//       createdAt: "2023-05-15T10:20:30Z",
//       updatedAt: "2023-05-25T11:45:22Z",
//       period: {
//         id: "period1",
//         name: "Periode 2023-2024",
//       },
//       responsible: {
//         id: "user2",
//         name: "Siti Rahayu",
//         email: "siti.rahayu@example.com",
//       },
//       workProgram: {
//         id: "wp2",
//         name: "Program Pengembangan SDM",
//       },
//     },
//     {
//       id: "3",
//       name: "Research Competition",
//       description: "Kompetisi penelitian untuk mahasiswa",
//       responsibleId: "user3",
//       goal: "Mendorong budaya penelitian di kalangan mahasiswa",
//       department: Department.LITBANG,
//       periodId: "period1",
//       startDate: "2023-07-10T08:00:00Z",
//       endDate: "2023-07-12T17:00:00Z",
//       funds: 10000000,
//       usedFunds: 0,
//       remainingFunds: 10000000,
//       thumbnail: "/images/events/research-competition.jpg",
//       status: Status.PENDING,
//       workProgramId: "wp3",
//       createdAt: "2023-06-01T14:15:20Z",
//       updatedAt: "2023-06-01T14:15:20Z",
//       period: {
//         id: "period1",
//         name: "Periode 2023-2024",
//       },
//       responsible: {
//         id: "user3",
//         name: "Budi Santoso",
//         email: "budi.santoso@example.com",
//       },
//       workProgram: {
//         id: "wp3",
//         name: "Program Penelitian dan Pengembangan",
//       },
//     },
//     {
//       id: "4",
//       name: "Bazaar Kewirausahaan",
//       description: "Bazaar untuk produk-produk kewirausahaan mahasiswa",
//       responsibleId: "user4",
//       goal: "Mendorong semangat kewirausahaan",
//       department: Department.KWU,
//       periodId: "period1",
//       startDate: "2023-08-05T09:00:00Z",
//       endDate: "2023-08-06T21:00:00Z",
//       funds: 8000000,
//       usedFunds: 0,
//       remainingFunds: 8000000,
//       thumbnail: "/images/events/bazaar-kwu.jpg",
//       status: Status.DRAFT,
//       createdAt: "2023-06-10T11:30:45Z",
//       updatedAt: "2023-06-10T11:30:45Z",
//       period: {
//         id: "period1",
//         name: "Periode 2023-2024",
//       },
//       responsible: {
//         id: "user4",
//         name: "Dewi Anggraini",
//         email: "dewi.anggraini@example.com",
//       },
//     },
//     {
//       id: "5",
//       name: "Workshop Digital Marketing",
//       description: "Workshop tentang strategi pemasaran digital",
//       responsibleId: "user5",
//       goal: "Meningkatkan kemampuan pemasaran digital anggota",
//       department: Department.KWU,
//       periodId: "period1",
//       startDate: "2023-04-22T13:00:00Z",
//       endDate: "2023-04-22T16:00:00Z",
//       funds: 3500000,
//       usedFunds: 3500000,
//       remainingFunds: 0,
//       thumbnail: "/images/events/digital-marketing.jpg",
//       status: Status.CANCELLED,
//       workProgramId: "wp4",
//       createdAt: "2023-03-15T09:45:30Z",
//       updatedAt: "2023-04-20T10:15:40Z",
//       period: {
//         id: "period1",
//         name: "Periode 2023-2024",
//       },
//       responsible: {
//         id: "user5",
//         name: "Rizky Pratama",
//         email: "rizky.pratama@example.com",
//       },
//       workProgram: {
//         id: "wp4",
//         name: "Program Kewirausahaan",
//       },
//     },
//   ]);

//   const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState<Department | "all">(
//     "all"
//   );
//   const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
//   const [periodFilter, setPeriodFilter] = useState<string>("all");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [sortField, setSortField] = useState("startDate");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

//   // Get unique periods for filter
//   const periods = Array.from(new Set(events.map((e) => e.period.id)))
//     .map((id) => {
//       const event = events.find((e) => e.period.id === id);
//       return event?.period;
//     })
//     .filter(Boolean) as { id: string; name: string }[];

//   // Filter events based on search term and filters
//   const filteredEvents = events.filter((event) => {
//     const matchesSearch =
//       event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.responsible.name.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesDepartment =
//       departmentFilter === "all" || event.department === departmentFilter;
//     const matchesStatus =
//       statusFilter === "all" || event.status === statusFilter;
//     const matchesPeriod =
//       periodFilter === "all" || event.period.id === periodFilter;

//     return matchesSearch && matchesDepartment && matchesStatus && matchesPeriod;
//   });

//   // Sort events
//   const sortedEvents = [...filteredEvents].sort((a, b) => {
//     let aValue, bValue;

//     switch (sortField) {
//       case "name":
//         aValue = a.name;
//         bValue = b.name;
//         break;
//       case "department":
//         aValue = a.department;
//         bValue = b.department;
//         break;
//       case "status":
//         aValue = a.status;
//         bValue = b.status;
//         break;
//       case "startDate":
//         aValue = a.startDate;
//         bValue = b.startDate;
//         break;
//       case "funds":
//         aValue = a.funds;
//         bValue = b.funds;
//         break;
//       case "responsible":
//         aValue = a.responsible.name;
//         bValue = b.responsible.name;
//         break;
//       default:
//         aValue = a.startDate;
//         bValue = b.startDate;
//     }

//     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });

//   // Toggle event selection
//   const toggleEventSelection = (id: string) => {
//     if (selectedEvents.includes(id)) {
//       setSelectedEvents(selectedEvents.filter((eventId) => eventId !== id));
//     } else {
//       setSelectedEvents([...selectedEvents, id]);
//     }
//   };

//   // Select all events on current page
//   const toggleSelectAll = () => {
//     if (selectedEvents.length === filteredEvents.length) {
//       setSelectedEvents([]);
//     } else {
//       setSelectedEvents(filteredEvents.map((event) => event.id));
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

//   // Navigate to add event page
//   const handleAddEvent = () => {
//     router.push("/dashboard/events/create");
//   };

//   // Navigate to edit event page
//   const handleEditEvent = (id: string) => {
//     router.push(`/dashboard/events/edit/${id}`);
//   };

//   // View event details
//   const handleViewEvent = (id: string) => {
//     router.push(`/dashboard/events/view/${id}`);
//   };

//   // Delete event(s)
//   const handleDelete = (event?: Event) => {
//     if (event) {
//       setCurrentEvent(event);
//     }
//     setShowDeleteModal(true);
//   };

//   // Execute deletion
//   const confirmDelete = () => {
//     if (currentEvent) {
//       // Delete single event
//       setEvents(events.filter((event) => event.id !== currentEvent.id));
//     } else if (selectedEvents.length > 0) {
//       // Delete multiple events
//       setEvents(events.filter((event) => !selectedEvents.includes(event.id)));
//       setSelectedEvents([]);
//     }
//     setShowDeleteModal(false);
//     setCurrentEvent(null);
//   };

//   // Get department badge class
//   const getDepartmentClass = (department: Department) => {
//     switch (department) {
//       case Department.INFOKOM:
//         return "bg-blue-100 text-blue-800";
//       case Department.PSDM:
//         return "bg-green-100 text-green-800";
//       case Department.LITBANG:
//         return "bg-purple-100 text-purple-800";
//       case Department.KWU:
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Get status badge class
//   const getStatusClass = (status: Status) => {
//     switch (status) {
//       case Status.DRAFT:
//         return "bg-gray-100 text-gray-800";
//       case Status.PENDING:
//         return "bg-yellow-100 text-yellow-800";
//       case Status.APPROVED:
//         return "bg-green-100 text-green-800";
//       case Status.REJECTED:
//         return "bg-red-100 text-red-800";
//       case Status.COMPLETED:
//         return "bg-blue-100 text-blue-800";
//       case Status.CANCELLED:
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Get status display name
//   const getStatusDisplayName = (status: Status) => {
//     switch (status) {
//       case Status.DRAFT:
//         return "Draft";
//       case Status.PENDING:
//         return "Menunggu";
//       case Status.APPROVED:
//         return "Disetujui";
//       case Status.REJECTED:
//         return "Ditolak";
//       case Status.COMPLETED:
//         return "Selesai";
//       case Status.CANCELLED:
//         return "Dibatalkan";
//       default:
//         return status;
//     }
//   };

//   // Get department display name
//   const getDepartmentDisplayName = (department: Department) => {
//     switch (department) {
//       case Department.INFOKOM:
//         return "INFOKOM";
//       case Department.PSDM:
//         return "PSDM";
//       case Department.LITBANG:
//         return "LITBANG";
//       case Department.KWU:
//         return "KWU";
//       default:
//         return department;
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

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Calculate progress percentage for funds usage
//   const calculateFundsProgress = (used: number, total: number) => {
//     if (total === 0) return 0;
//     return Math.round((used / total) * 100);
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
//           <h1 className="text-2xl font-bold text-gray-800">Manajemen Event</h1>
//           <p className="text-gray-600 mt-1">
//             Kelola semua event dan kegiatan organisasi
//           </p>
//         </div>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
//           onClick={handleAddEvent}
//         >
//           <FiPlus className="mr-2" />
//           Tambah Event
//         </button>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Total Event</h3>
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <FiCalendar className="text-blue-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {events.length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Anggaran
//             </h3>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FiDollarSign className="text-green-500" />
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-800 mt-2">
//             {formatCurrency(
//               events.reduce((sum, event) => sum + event.funds, 0)
//             )}
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
//             {events.filter((e) => e.status === Status.PENDING).length}
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
//             {events.filter((e) => e.status === Status.APPROVED).length}
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
//               placeholder="Cari nama event, deskripsi, atau penanggung jawab..."
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
//                 Departemen
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={departmentFilter}
//                 onChange={(e) =>
//                   setDepartmentFilter(e.target.value as Department | "all")
//                 }
//               >
//                 <option value="all">Semua Departemen</option>
//                 <option value={Department.INFOKOM}>INFOKOM</option>
//                 <option value={Department.PSDM}>PSDM</option>
//                 <option value={Department.LITBANG}>LITBANG</option>
//                 <option value={Department.KWU}>KWU</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={statusFilter}
//                 onChange={(e) =>
//                   setStatusFilter(e.target.value as Status | "all")
//                 }
//               >
//                 <option value="all">Semua Status</option>
//                 <option value={Status.DRAFT}>Draft</option>
//                 <option value={Status.PENDING}>Menunggu</option>
//                 <option value={Status.APPROVED}>Disetujui</option>
//                 <option value={Status.REJECTED}>Ditolak</option>
//                 <option value={Status.COMPLETED}>Selesai</option>
//                 <option value={Status.CANCELLED}>Dibatalkan</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Periode
//               </label>
//               <select
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={periodFilter}
//                 onChange={(e) => setPeriodFilter(e.target.value)}
//               >
//                 <option value="all">Semua Periode</option>
//                 {periods.map((period) => (
//                   <option key={period.id} value={period.id}>
//                     {period.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
//                   selectedEvents.length === 0
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-red-50 text-red-700 hover:bg-red-100"
//                 }`}
//                 onClick={() => handleDelete()}
//                 disabled={selectedEvents.length === 0}
//               >
//                 <FiTrash2 className="mr-2" />
//                 Hapus Terpilih ({selectedEvents.length})
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Events Table */}
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
//                       filteredEvents.length > 0 &&
//                       selectedEvents.length === filteredEvents.length
//                     }
//                     onChange={toggleSelectAll}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                   />
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("name")}
//                 >
//                   <div className="flex items-center">
//                     Nama Event
//                     {getSortIcon("name")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("department")}
//                 >
//                   <div className="flex items-center">
//                     Departemen
//                     {getSortIcon("department")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("startDate")}
//                 >
//                   <div className="flex items-center">
//                     Tanggal
//                     {getSortIcon("startDate")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("responsible")}
//                 >
//                   <div className="flex items-center">
//                     Penanggung Jawab
//                     {getSortIcon("responsible")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("funds")}
//                 >
//                   <div className="flex items-center">
//                     Anggaran
//                     {getSortIcon("funds")}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort("status")}
//                 >
//                   <div className="flex items-center">
//                     Status
//                     {getSortIcon("status")}
//                   </div>
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
//               {sortedEvents.map((event) => (
//                 <tr
//                   key={event.id}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="pl-6 pr-2 py-4 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       checked={selectedEvents.includes(event.id)}
//                       onChange={() => toggleEventSelection(event.id)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                     />
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center">
//                       {event.thumbnail && (
//                         <img
//                           src={event.thumbnail}
//                           alt={event.name}
//                           className="h-10 w-10 rounded-lg object-cover mr-3"
//                         />
//                       )}
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {event.name}
//                         </div>
//                         <div className="text-xs text-gray-500 line-clamp-1">
//                           {event.description}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getDepartmentClass(
//                         event.department
//                       )}`}
//                     >
//                       {getDepartmentDisplayName(event.department)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {formatDate(event.startDate)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       s/d {formatDate(event.endDate)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="text-sm text-gray-900">
//                       {event.responsible.name}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {event.responsible.email}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {formatCurrency(event.funds)}
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
//                       <div
//                         className={`h-1.5 rounded-full ${
//                           calculateFundsProgress(event.usedFunds, event.funds) >
//                           90
//                             ? "bg-red-500"
//                             : calculateFundsProgress(
//                                 event.usedFunds,
//                                 event.funds
//                               ) > 70
//                             ? "bg-yellow-500"
//                             : "bg-green-500"
//                         }`}
//                         style={{
//                           width: `${calculateFundsProgress(
//                             event.usedFunds,
//                             event.funds
//                           )}%`,
//                         }}
//                       />
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {calculateFundsProgress(event.usedFunds, event.funds)}%
//                       digunakan
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
//                         event.status
//                       )}`}
//                     >
//                       {getStatusDisplayName(event.status)}
//                     </span>
//                   </td>
//                   <td className="pl-4 pr-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//                         onClick={() => handleViewEvent(event.id)}
//                         title="Lihat detail"
//                       >
//                         <FiEye size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                         onClick={() => handleEditEvent(event.id)}
//                         title="Edit event"
//                       >
//                         <FiEdit size={16} />
//                       </button>
//                       <button
//                         className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                         onClick={() => handleDelete(event)}
//                         title="Hapus event"
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

//         {sortedEvents.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-2">
//               <FiCalendar size={48} className="mx-auto" />
//             </div>
//             <p className="text-gray-500 text-lg font-medium">
//               Tidak ada event ditemukan
//             </p>
//             <p className="text-gray-400 mt-1">
//               Coba sesuaikan pencarian atau filter Anda
//             </p>
//           </div>
//         )}

//         {/* Table Footer */}
//         {sortedEvents.length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
//             <p className="text-sm text-gray-700 mb-4 sm:mb-0">
//               Menampilkan{" "}
//               <span className="font-medium">{sortedEvents.length}</span> dari{" "}
//               <span className="font-medium">{events.length}</span> event
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
//                     setCurrentEvent(null);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600">
//                 {currentEvent
//                   ? `Apakah Anda yakin ingin menghapus event "${currentEvent.name}"? Tindakan ini tidak dapat dibatalkan.`
//                   : `Apakah Anda yakin ingin menghapus ${selectedEvents.length} event terpilih? Tindakan ini tidak dapat dibatalkan.`}
//               </p>
//             </div>
//             <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setCurrentEvent(null);
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
