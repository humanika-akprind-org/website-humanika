// app/dashboard/letters/page.tsx
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
  FiFileText,
  FiX,
  FiChevronDown,
  FiClock,
  FiCheckCircle,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
} from "react-icons/fi";

interface Letter {
  id: string;
  number: string | null;
  regarding: string;
  origin: string;
  destination: string;
  date: string;
  type: "INCOMING" | "OUTGOING" | "INTERNAL";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  body: string | null;
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  createdById: string;
  approvedById: string | null;
  periodId: string | null;
  eventId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  approvedBy?: {
    name: string;
    email: string;
  };
  event?: {
    name: string;
  };
}

export default function LettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([
    {
      id: "1",
      number: "001/ORG/XI/2023",
      regarding: "Permohonan Izin Penelitian",
      origin: "Universitas Negeri Malang",
      destination: "Dinas Pendidikan Kota Malang",
      date: "2023-11-05T00:00:00Z",
      type: "INCOMING",
      priority: "NORMAL",
      body: "Dengan hormat, kami dari Universitas Negeri Malang bermaksud untuk mengajukan permohonan izin penelitian...",
      notes: "Segera ditindaklanjuti",
      status: "PENDING",
      createdById: "user1",
      approvedById: null,
      periodId: "period1",
      eventId: "event1",
      createdAt: "2023-11-01T09:32:45Z",
      updatedAt: "2023-11-01T09:32:45Z",
      createdBy: {
        name: "John Doe",
        email: "john.doe@organization.org",
      },
      event: {
        name: "Research Permission",
      },
    },
    {
      id: "2",
      number: "002/ORG/XI/2023",
      regarding: "Undangan Rapat Koordinasi",
      origin: "Dinas Pendidikan Kota Malang",
      destination: "Seluruh Kepala Sekolah",
      date: "2023-11-10T00:00:00Z",
      type: "OUTGOING",
      priority: "HIGH",
      body: "Dalam rangka koordinasi program pendidikan, kami mengundang Bapak/Ibu untuk hadir dalam rapat...",
      notes: "Telah disetujui oleh kepala dinas",
      status: "APPROVED",
      createdById: "user2",
      approvedById: "user3",
      periodId: "period1",
      eventId: null,
      createdAt: "2023-11-03T14:20:12Z",
      updatedAt: "2023-11-04T10:15:30Z",
      createdBy: {
        name: "Alice Smith",
        email: "alice.smith@organization.org",
      },
      approvedBy: {
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
    },
    {
      id: "3",
      number: "003/ORG/XI/2023",
      regarding: "Laporan Keuangan Triwulan III",
      origin: "Bendahara",
      destination: "Kepala Dinas",
      date: "2023-11-15T00:00:00Z",
      type: "INTERNAL",
      priority: "NORMAL",
      body: "Berikut kami sampaikan laporan keuangan triwulan III tahun 2023...",
      notes: null,
      status: "APPROVED",
      createdById: "user4",
      approvedById: "user3",
      periodId: "period1",
      eventId: null,
      createdAt: "2023-11-10T11:45:23Z",
      updatedAt: "2023-11-12T13:42:18Z",
      createdBy: {
        name: "Emily Wilson",
        email: "emily.wilson@organization.org",
      },
      approvedBy: {
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
    },
    {
      id: "4",
      number: "004/ORG/XI/2023",
      regarding: "Pengumuman Libur Nasional",
      origin: "Kepala Dinas",
      destination: "Seluruh Staf",
      date: "2023-11-20T00:00:00Z",
      type: "INTERNAL",
      priority: "NORMAL",
      body: "Diberitahukan kepada seluruh staf bahwa pada tanggal 25 November 2023 akan diliburkan...",
      notes: "Segera disebarkan",
      status: "REJECTED",
      createdById: "user3",
      approvedById: null,
      periodId: "period1",
      eventId: null,
      createdAt: "2023-11-15T16:30:55Z",
      updatedAt: "2023-11-16T09:15:22Z",
      createdBy: {
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
    },
    {
      id: "5",
      number: "005/ORG/XI/2023",
      regarding: "Permintaan Data Statistik",
      origin: "Badan Pusat Statistik",
      destination: "Dinas Pendidikan Kota Malang",
      date: "2023-11-25T00:00:00Z",
      type: "INCOMING",
      priority: "URGENT",
      body: "Sehubungan dengan penyusunan data statistik pendidikan nasional, kami mohon kiranya dapat mengirimkan data...",
      notes: "Prioritas tinggi",
      status: "PENDING",
      createdById: "user1",
      approvedById: null,
      periodId: "period1",
      eventId: "event2",
      createdAt: "2023-11-18T08:12:37Z",
      updatedAt: "2023-11-18T08:12:37Z",
      createdBy: {
        name: "John Doe",
        email: "john.doe@organization.org",
      },
      event: {
        name: "Data Collection",
      },
    },
    {
      id: "6",
      number: "006/ORG/XI/2023",
      regarding: "Surat Tugas Pengawasan",
      origin: "Kepala Dinas",
      destination: "Tim Pengawas",
      date: "2023-11-28T00:00:00Z",
      type: "OUTGOING",
      priority: "HIGH",
      body: "Dengan ini menugaskan kepada tim pengawas untuk melakukan monitoring dan evaluasi di sekolah-sekolah...",
      notes: null,
      status: "ARCHIVED",
      createdById: "user3",
      approvedById: "user3",
      periodId: "period1",
      eventId: null,
      createdAt: "2023-11-20T10:35:21Z",
      updatedAt: "2023-11-22T14:20:05Z",
      createdBy: {
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
      approvedBy: {
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
    },
  ]);

  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter letters based on search term and filters
  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.regarding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (letter.number?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      letter.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || letter.status === statusFilter;
    const matchesType = typeFilter === "all" || letter.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || letter.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Sort letters
  const sortedLetters = [...filteredLetters].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "number":
        aValue = a.number || "";
        bValue = b.number || "";
        break;
      case "regarding":
        aValue = a.regarding;
        bValue = b.regarding;
        break;
      case "date":
        aValue = a.date;
        bValue = b.date;
        break;
      case "priority":
        aValue = a.priority;
        bValue = b.priority;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Toggle letter selection
  const toggleLetterSelection = (id: string) => {
    if (selectedLetters.includes(id)) {
      setSelectedLetters(selectedLetters.filter((letterId) => letterId !== id));
    } else {
      setSelectedLetters([...selectedLetters, id]);
    }
  };

  // Select all letters on current page
  const toggleSelectAll = () => {
    if (selectedLetters.length === filteredLetters.length) {
      setSelectedLetters([]);
    } else {
      setSelectedLetters(filteredLetters.map((letter) => letter.id));
    }
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Navigate to add letter page
  const handleAddLetter = () => {
    router.push("/admin/administration/letters/add");
  };

  // Navigate to edit letter page
  const handleEditLetter = (id: string) => {
    router.push(`/admin/administration/letters/edit/${id}`);
  };

  // View letter details
  const handleViewLetter = (id: string) => {
    router.push(`/admin/administration/letters/view/${id}`);
  };

  // Delete letter(s)
  const handleDelete = (letter?: Letter) => {
    if (letter) {
      setCurrentLetter(letter);
    }
    setShowDeleteModal(true);
  };

  // Change letter status
  const handleChangeStatus = (letterId: string, status: Letter["status"]) => {
    setLetters(
      letters.map((letter) =>
        letter.id === letterId ? { ...letter, status } : letter
      )
    );
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentLetter) {
      // Delete single letter
      setLetters(letters.filter((letter) => letter.id !== currentLetter.id));
    } else if (selectedLetters.length > 0) {
      // Delete multiple letters
      setLetters(
        letters.filter((letter) => !selectedLetters.includes(letter.id))
      );
      setSelectedLetters([]);
    }
    setShowDeleteModal(false);
    setCurrentLetter(null);
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

  // Get type badge class
  const getTypeClass = (type: string) => {
    switch (type) {
      case "INCOMING":
        return "bg-blue-100 text-blue-800";
      case "OUTGOING":
        return "bg-purple-100 text-purple-800";
      case "INTERNAL":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority badge class
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-gray-100 text-gray-800";
      case "NORMAL":
        return "bg-green-100 text-green-800";
      case "HIGH":
        return "bg-yellow-100 text-yellow-800";
      case "URGENT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Surat</h1>
          <p className="text-gray-600 mt-1">
            Kelola semua surat masuk, keluar, dan internal
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddLetter}
        >
          <FiPlus className="mr-2" />
          Buat Surat Baru
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Surat</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {letters.length}
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
            {letters.filter((l) => l.status === "PENDING").length}
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
            {letters.filter((l) => l.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Diarsipkan</h3>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiFileText className="text-gray-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {letters.filter((l) => l.status === "ARCHIVED").length}
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
              placeholder="Cari surat berdasarkan perihal, nomor, asal, atau tujuan..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Semua Jenis</option>
                <option value="INCOMING">Masuk</option>
                <option value="OUTGOING">Keluar</option>
                <option value="INTERNAL">Internal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioritas
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">Semua Prioritas</option>
                <option value="LOW">Rendah</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Tinggi</option>
                <option value="URGENT">Darurat</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedLetters.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedLetters.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Hapus Terpilih ({selectedLetters.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Letters Table */}
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
                      filteredLetters.length > 0 &&
                      selectedLetters.length === filteredLetters.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("number")}
                >
                  <div className="flex items-center">
                    No. Surat
                    {getSortIcon("number")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("regarding")}
                >
                  <div className="flex items-center">
                    Perihal
                    {getSortIcon("regarding")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Asal/Tujuan
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Tanggal
                    {getSortIcon("date")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jenis
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center">
                    Prioritas
                    {getSortIcon("priority")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {sortedLetters.map((letter) => (
                <tr
                  key={letter.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLetters.includes(letter.id)}
                      onChange={() => toggleLetterSelection(letter.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {letter.number || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {letter.regarding}
                    </div>
                    {letter.event && (
                      <div className="text-xs text-gray-500 mt-1">
                        Acara: {letter.event.name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiArrowDown className="text-blue-500 mr-1" size={12} />
                        {letter.origin}
                      </div>
                      <div className="flex items-center mt-1">
                        <FiArrowUp className="text-green-500 mr-1" size={12} />
                        {letter.destination}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" size={14} />
                      {formatDate(letter.date)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeClass(
                        letter.type
                      )}`}
                    >
                      {letter.type === "INCOMING"
                        ? "Masuk"
                        : letter.type === "OUTGOING"
                        ? "Keluar"
                        : "Internal"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityClass(
                        letter.priority
                      )}`}
                    >
                      {letter.priority === "LOW"
                        ? "Rendah"
                        : letter.priority === "NORMAL"
                        ? "Normal"
                        : letter.priority === "HIGH"
                        ? "Tinggi"
                        : "Darurat"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        letter.status
                      )}`}
                    >
                      {letter.status === "PENDING"
                        ? "Menunggu"
                        : letter.status === "APPROVED"
                        ? "Disetujui"
                        : letter.status === "REJECTED"
                        ? "Ditolak"
                        : "Diarsipkan"}
                    </span>
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleViewLetter(letter.id)}
                        title="Lihat detail"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => handleEditLetter(letter.id)}
                        title="Edit surat"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(letter)}
                        title="Hapus surat"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      {letter.status !== "ARCHIVED" && (
                        <button
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() =>
                            handleChangeStatus(letter.id, "ARCHIVED")
                          }
                          title="Arsipkan surat"
                        >
                          <FiFileText size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedLetters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiFileText size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Tidak ada surat ditemukan
            </p>
            <p className="text-gray-400 mt-1">
              Coba sesuaikan pencarian atau filter Anda
            </p>
          </div>
        )}

        {/* Table Footer */}
        {sortedLetters.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Menampilkan{" "}
              <span className="font-medium">{sortedLetters.length}</span> dari{" "}
              <span className="font-medium">{letters.length}</span> surat
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
                    setCurrentLetter(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentLetter
                  ? `Apakah Anda yakin ingin menghapus surat "${currentLetter.regarding}"? Tindakan ini tidak dapat dibatalkan.`
                  : `Apakah Anda yakin ingin menghapus ${selectedLetters.length} surat terpilih? Tindakan ini tidak dapat dibatalkan.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentLetter(null);
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
