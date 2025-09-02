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
  FiCheckCircle,
  FiClock,
  FiX,
  FiChevronDown,
  FiUser,
  FiList,
  FiCheckSquare,
  FiAlertCircle,
} from "react-icons/fi";

// Enum Department
enum Department {
  INFOKOM = "INFOKOM",
  PSDM = "PSDM",
  LITBANG = "LITBANG",
  KWU = "KWU",
}

// Enum Status
enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

interface DepartmentTask {
  id: string;
  note: string;
  department: Department;
  userId?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  // Relations
  user?: {
    id: string;
    name: string;
    email: string;
  };
  approvals: {
    id: string;
    status: Status;
    createdAt: string;
    user: {
      name: string;
    };
  }[];
}

export default function DepartmentTaskManagementPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<DepartmentTask[]>([
    {
      id: "1",
      note: "Mempersiapkan materi webinar teknologi terkini",
      department: Department.INFOKOM,
      userId: "user1",
      status: Status.COMPLETED,
      createdAt: "2023-05-10T08:30:45Z",
      updatedAt: "2023-05-12T14:20:12Z",
      user: {
        id: "user1",
        name: "Ahmad Rizki",
        email: "ahmad.rizki@example.com",
      },
      approvals: [
        {
          id: "app1",
          status: Status.APPROVED,
          createdAt: "2023-05-11T10:15:30Z",
          user: {
            name: "Manager INFOKOM",
          },
        },
      ],
    },
    {
      id: "2",
      note: "Melakukan recruitment anggota baru departemen PSDM",
      department: Department.PSDM,
      userId: "user2",
      status: Status.IN_PROGRESS,
      createdAt: "2023-06-15T09:20:33Z",
      updatedAt: "2023-06-20T16:45:22Z",
      user: {
        id: "user2",
        name: "Siti Rahayu",
        email: "siti.rahayu@example.com",
      },
      approvals: [],
    },
    {
      id: "3",
      note: "Menelitian inovasi produk terbaru untuk tahun 2023",
      department: Department.LITBANG,
      userId: "user3",
      status: Status.PENDING,
      createdAt: "2023-07-05T11:45:18Z",
      updatedAt: "2023-07-05T11:45:18Z",
      user: {
        id: "user3",
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
      },
      approvals: [],
    },
    {
      id: "4",
      note: "Mengelola keuangan dan pembukuan untuk event bazaar",
      department: Department.KWU,
      userId: "user4",
      status: Status.REJECTED,
      createdAt: "2023-08-01T14:30:55Z",
      updatedAt: "2023-08-03T09:15:40Z",
      user: {
        id: "user4",
        name: "Dewi Anggraini",
        email: "dewi.anggraini@example.com",
      },
      approvals: [
        {
          id: "app2",
          status: Status.REJECTED,
          createdAt: "2023-08-02T16:20:25Z",
          user: {
            name: "Manager KWU",
          },
        },
      ],
    },
    {
      id: "5",
      note: "Memperbarui website organisasi dengan konten terbaru",
      department: Department.INFOKOM,
      status: Status.PENDING,
      createdAt: "2023-08-10T10:15:27Z",
      updatedAt: "2023-08-10T10:15:27Z",
      approvals: [],
    },
    {
      id: "6",
      note: "Menyusun program mentoring untuk anggota baru",
      department: Department.PSDM,
      userId: "user2",
      status: Status.COMPLETED,
      createdAt: "2023-06-25T13:30:10Z",
      updatedAt: "2023-07-05T11:20:35Z",
      user: {
        id: "user2",
        name: "Siti Rahayu",
        email: "siti.rahayu@example.com",
      },
      approvals: [
        {
          id: "app3",
          status: Status.APPROVED,
          createdAt: "2023-07-01T09:45:15Z",
          user: {
            name: "Manager PSDM",
          },
        },
      ],
    },
    {
      id: "7",
      note: "Mengarsipkan dokumen penelitian tahun sebelumnya",
      department: Department.LITBANG,
      userId: "user3",
      status: Status.ARCHIVED,
      createdAt: "2023-07-20T15:45:22Z",
      updatedAt: "2023-07-25T10:30:18Z",
      user: {
        id: "user3",
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
      },
      approvals: [
        {
          id: "app4",
          status: Status.APPROVED,
          createdAt: "2023-07-22T14:15:30Z",
          user: {
            name: "Manager LITBANG",
          },
        },
      ],
    },
  ]);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<DepartmentTask | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Get unique users for filter
  const users = Array.from(
    new Set(tasks.map((t) => t.user?.id).filter(Boolean))
  )
    .map((id) => {
      const task = tasks.find((t) => t.user?.id === id);
      return task?.user;
    })
    .filter(Boolean) as { id: string; name: string; email: string }[];

  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesDepartment =
      departmentFilter === "all" || task.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    let matchesAssigned = true;
    if (assignedFilter !== "all") {
      if (assignedFilter === "assigned") {
        matchesAssigned = !!task.userId;
      } else if (assignedFilter === "unassigned") {
        matchesAssigned = !task.userId;
      } else {
        matchesAssigned = task.userId === assignedFilter;
      }
    }

    return (
      matchesSearch && matchesDepartment && matchesStatus && matchesAssigned
    );
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "note":
        aValue = a.note;
        bValue = b.note;
        break;
      case "department":
        aValue = a.department;
        bValue = b.department;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "user":
        aValue = a.user?.name || "";
        bValue = b.user?.name || "";
        break;
      case "createdAt":
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      case "updatedAt":
        aValue = a.updatedAt;
        bValue = b.updatedAt;
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Toggle task selection
  const toggleTaskSelection = (id: string) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  // Select all tasks on current page
  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
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

  // Navigate to add task page
  const handleAddTask = () => {
    router.push("/dashboard/department-tasks/create");
  };

  // Navigate to edit task page
  const handleEditTask = (id: string) => {
    router.push(`/dashboard/department-tasks/edit/${id}`);
  };

  // View task details
  const handleViewTask = (id: string) => {
    router.push(`/dashboard/department-tasks/view/${id}`);
  };

  // Update task status
  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  // Delete task(s)
  const handleDelete = (task?: DepartmentTask) => {
    if (task) {
      setCurrentTask(task);
    }
    setShowDeleteModal(true);
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentTask) {
      // Delete single task
      setTasks(tasks.filter((task) => task.id !== currentTask.id));
    } else if (selectedTasks.length > 0) {
      // Delete multiple tasks
      setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)));
      setSelectedTasks([]);
    }
    setShowDeleteModal(false);
    setCurrentTask(null);
  };

  // Get department badge class
  const getDepartmentClass = (department: Department) => {
    switch (department) {
      case Department.INFOKOM:
        return "bg-blue-100 text-blue-800";
      case Department.PSDM:
        return "bg-green-100 text-green-800";
      case Department.LITBANG:
        return "bg-purple-100 text-purple-800";
      case Department.KWU:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status badge class
  const getStatusClass = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case Status.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case Status.COMPLETED:
        return "bg-green-100 text-green-800";
      case Status.REJECTED:
        return "bg-red-100 text-red-800";
      case Status.ARCHIVED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status display name
  const getStatusDisplayName = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return "Menunggu";
      case Status.IN_PROGRESS:
        return "Dalam Proses";
      case Status.COMPLETED:
        return "Selesai";
      case Status.REJECTED:
        return "Ditolak";
      case Status.ARCHIVED:
        return "Diarsipkan";
      default:
        return status;
    }
  };

  // Get department display name
  const getDepartmentDisplayName = (department: Department) => {
    switch (department) {
      case Department.INFOKOM:
        return "INFOKOM";
      case Department.PSDM:
        return "PSDM";
      case Department.LITBANG:
        return "LITBANG";
      case Department.KWU:
        return "KWU";
      default:
        return department;
    }
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

  // Format datetime
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <FiChevronDown size={14} className="transform rotate-180" />
    ) : (
      <FiChevronDown size={14} />
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Tugas Departemen
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola semua tugas dan tanggung jawab departemen
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddTask}
        >
          <FiPlus className="mr-2" />
          Tambah Tugas
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Tugas</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiList className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {tasks.length}
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
            {tasks.filter((t) => t.status === Status.PENDING).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Dalam Proses</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiAlertCircle className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {tasks.filter((t) => t.status === Status.IN_PROGRESS).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Selesai</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckSquare className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {tasks.filter((t) => t.status === Status.COMPLETED).length}
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
              placeholder="Cari deskripsi tugas atau penanggung jawab..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(e.target.value as Department | "all")
                }
              >
                <option value="all">Semua Departemen</option>
                <option value={Department.INFOKOM}>INFOKOM</option>
                <option value={Department.PSDM}>PSDM</option>
                <option value={Department.LITBANG}>LITBANG</option>
                <option value={Department.KWU}>KWU</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as Status | "all")
                }
              >
                <option value="all">Semua Status</option>
                <option value={Status.PENDING}>Menunggu</option>
                <option value={Status.IN_PROGRESS}>Dalam Proses</option>
                <option value={Status.COMPLETED}>Selesai</option>
                <option value={Status.REJECTED}>Ditolak</option>
                <option value={Status.ARCHIVED}>Diarsipkan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penugasan
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
              >
                <option value="all">Semua Penugasan</option>
                <option value="assigned">Ditugaskan</option>
                <option value="unassigned">Belum Ditugaskan</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedTasks.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedTasks.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Hapus Terpilih ({selectedTasks.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tasks Table */}
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
                      filteredTasks.length > 0 &&
                      selectedTasks.length === filteredTasks.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("note")}
                >
                  <div className="flex items-center">
                    Deskripsi Tugas
                    {getSortIcon("note")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center">
                    Departemen
                    {getSortIcon("department")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("user")}
                >
                  <div className="flex items-center">
                    Penanggung Jawab
                    {getSortIcon("user")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
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
              {sortedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {task.note}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getDepartmentClass(
                        task.department
                      )}`}
                    >
                      {getDepartmentDisplayName(task.department)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {task.user ? (
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 rounded-lg mr-2">
                          <FiUser className="text-gray-500" size={14} />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">
                            {task.user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {task.user.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Belum ditugaskan
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        task.status
                      )}`}
                    >
                      {getStatusDisplayName(task.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(task.createdAt)}
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleViewTask(task.id)}
                        title="Lihat detail"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => handleEditTask(task.id)}
                        title="Edit tugas"
                      >
                        <FiEdit size={16} />
                      </button>
                      <div className="relative group">
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          title="Ubah status"
                        >
                          <FiCheckCircle size={16} />
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                          <div className="px-4 py-2 text-xs text-gray-500">
                            Ubah Status:
                          </div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                            onClick={() =>
                              handleUpdateStatus(task.id, Status.PENDING)
                            }
                          >
                            Menunggu
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              handleUpdateStatus(task.id, Status.IN_PROGRESS)
                            }
                          >
                            Dalam Proses
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            onClick={() =>
                              handleUpdateStatus(task.id, Status.COMPLETED)
                            }
                          >
                            Selesai
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleUpdateStatus(task.id, Status.REJECTED)
                            }
                          >
                            Ditolak
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              handleUpdateStatus(task.id, Status.ARCHIVED)
                            }
                          >
                            Diarsipkan
                          </button>
                        </div>
                      </div>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(task)}
                        title="Hapus tugas"
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

        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiList size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Tidak ada tugas ditemukan
            </p>
            <p className="text-gray-400 mt-1">
              Coba sesuaikan pencarian atau filter Anda
            </p>
          </div>
        )}

        {/* Table Footer */}
        {sortedTasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Menampilkan{" "}
              <span className="font-medium">{sortedTasks.length}</span> dari{" "}
              <span className="font-medium">{tasks.length}</span> tugas
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
                    setCurrentTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentTask
                  ? `Apakah Anda yakin ingin menghapus tugas "${currentTask.note}"? Tindakan ini tidak dapat dibatalkan.`
                  : `Apakah Anda yakin ingin menghapus ${selectedTasks.length} tugas terpilih? Tindakan ini tidak dapat dibatalkan.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentTask(null);
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
