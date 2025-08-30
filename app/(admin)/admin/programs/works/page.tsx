// app/dashboard/work-programs/page.tsx
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
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiX,
  FiChevronDown,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface WorkProgram {
  id: string;
  name: string;
  department: string;
  schedule: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "COMPLETED";
  funds: number;
  usedFunds: number;
  remainingFunds: number;
  goal: string;
  period: string;
  responsible: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function WorkProgramPage() {
  const router = useRouter();
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([
    {
      id: "1",
      name: "Digital Transformation Initiative",
      department: "IT",
      schedule: "Q3 2023 - Q2 2024",
      status: "APPROVED",
      funds: 500000,
      usedFunds: 125000,
      remainingFunds: 375000,
      goal: "Modernize company infrastructure and implement cloud solutions",
      period: "2023-Q3",
      responsible: {
        id: "1",
        name: "John Doe",
        email: "john.doe@organization.org",
      },
      createdAt: "2023-06-15T00:00:00Z",
      updatedAt: "2023-08-20T00:00:00Z",
    },
    {
      id: "2",
      name: "Marketing Campaign - Product Launch",
      department: "Marketing",
      schedule: "Q4 2023",
      status: "SUBMITTED",
      funds: 250000,
      usedFunds: 0,
      remainingFunds: 250000,
      goal: "Launch new product with comprehensive marketing strategy",
      period: "2023-Q4",
      responsible: {
        id: "2",
        name: "Alice Smith",
        email: "alice.smith@organization.org",
      },
      createdAt: "2023-08-10T00:00:00Z",
      updatedAt: "2023-09-05T00:00:00Z",
    },
    {
      id: "3",
      name: "Employee Training Program",
      department: "HR",
      schedule: "Q3 2023 - Q1 2024",
      status: "COMPLETED",
      funds: 150000,
      usedFunds: 142500,
      remainingFunds: 7500,
      goal: "Enhance employee skills through targeted training programs",
      period: "2023-Q3",
      responsible: {
        id: "4",
        name: "Emily Wilson",
        email: "emily.wilson@organization.org",
      },
      createdAt: "2023-05-20T00:00:00Z",
      updatedAt: "2023-09-15T00:00:00Z",
    },
    {
      id: "4",
      name: "Operational Efficiency Review",
      department: "Operations",
      schedule: "Q4 2023",
      status: "DRAFT",
      funds: 75000,
      usedFunds: 0,
      remainingFunds: 75000,
      goal: "Identify and implement operational improvements",
      period: "2023-Q4",
      responsible: {
        id: "5",
        name: "Michael Brown",
        email: "michael.b@organization.org",
      },
      createdAt: "2023-09-01T00:00:00Z",
      updatedAt: "2023-09-18T00:00:00Z",
    },
    {
      id: "5",
      name: "Financial System Upgrade",
      department: "Finance",
      schedule: "Q4 2023 - Q2 2024",
      status: "REJECTED",
      funds: 300000,
      usedFunds: 0,
      remainingFunds: 300000,
      goal: "Implement new financial management software",
      period: "2023-Q4",
      responsible: {
        id: "3",
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
      createdAt: "2023-07-10T00:00:00Z",
      updatedAt: "2023-08-25T00:00:00Z",
    },
  ]);

  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<WorkProgram | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter work programs based on search term and filters
  const filteredPrograms = workPrograms.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || program.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || program.department === departmentFilter;
    const matchesPeriod =
      periodFilter === "all" || program.period === periodFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesPeriod;
  });

  // Toggle program selection
  const toggleProgramSelection = (id: string) => {
    if (selectedPrograms.includes(id)) {
      setSelectedPrograms(
        selectedPrograms.filter((programId) => programId !== id)
      );
    } else {
      setSelectedPrograms([...selectedPrograms, id]);
    }
  };

  // Select all programs on current page
  const toggleSelectAll = () => {
    if (selectedPrograms.length === filteredPrograms.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(filteredPrograms.map((program) => program.id));
    }
  };

  // Navigate to add work program page
  const handleAddProgram = () => {
    router.push("/dashboard/work-programs/add");
  };

  // Navigate to edit work program page
  const handleEditProgram = (id: string) => {
    router.push(`/dashboard/work-programs/edit/${id}`);
  };

  // Navigate to view work program page
  const handleViewProgram = (id: string) => {
    router.push(`/dashboard/work-programs/${id}`);
  };

  // Delete program(s)
  const handleDelete = (program?: WorkProgram) => {
    if (program) {
      setCurrentProgram(program);
    }
    setShowDeleteModal(true);
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentProgram) {
      // Delete single program
      setWorkPrograms(
        workPrograms.filter((program) => program.id !== currentProgram.id)
      );
    } else if (selectedPrograms.length > 0) {
      // Delete multiple programs
      setWorkPrograms(
        workPrograms.filter((program) => !selectedPrograms.includes(program.id))
      );
      setSelectedPrograms([]);
    }
    setShowDeleteModal(false);
    setCurrentProgram(null);
  };

  // Get status badge class and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiClock className="mr-1" />,
          text: "Draft",
        };
      case "SUBMITTED":
        return {
          class: "bg-blue-100 text-blue-800",
          icon: <FiAlertCircle className="mr-1" />,
          text: "Submitted",
        };
      case "APPROVED":
        return {
          class: "bg-green-100 text-green-800",
          icon: <FiCheckCircle className="mr-1" />,
          text: "Approved",
        };
      case "REJECTED":
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiXCircle className="mr-1" />,
          text: "Rejected",
        };
      case "COMPLETED":
        return {
          class: "bg-purple-100 text-purple-800",
          icon: <FiCheckCircle className="mr-1" />,
          text: "Completed",
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiClock className="mr-1" />,
          text: status,
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate usage percentage
  const calculateUsagePercentage = (used: number, total: number) => {
    if (total === 0) return 0;
    return (used / total) * 100;
  };

  // Get departments from work programs
  const departments = Array.from(
    new Set(workPrograms.map((program) => program.department))
  );
  // Get periods from work programs
  const periods = Array.from(
    new Set(workPrograms.map((program) => program.period))
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Work Programs</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all organizational work programs
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddProgram}
        >
          <FiPlus className="mr-2" />
          New Work Program
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Programs
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiTrendingUp className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {workPrograms.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(
              workPrograms.reduce((sum, program) => sum + program.funds, 0)
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Used Funds</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiDollarSign className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(
              workPrograms.reduce((sum, program) => sum + program.usedFunds, 0)
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Remaining Funds
            </h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiDollarSign className="text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(
              workPrograms.reduce(
                (sum, program) => sum + program.remainingFunds,
                0
              )
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
              placeholder="Search work programs by name or goal..."
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
            Filters
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
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="all">All Periods</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedPrograms.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedPrograms.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Delete Selected ({selectedPrograms.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Work Programs Table */}
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
                      filteredPrograms.length > 0 &&
                      selectedPrograms.length === filteredPrograms.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Program
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Budget & Usage
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Responsible
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Period
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.map((program) => {
                const statusInfo = getStatusInfo(program.status);
                const usagePercentage = calculateUsagePercentage(
                  program.usedFunds,
                  program.funds
                );

                return (
                  <tr
                    key={program.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program.id)}
                        onChange={() => toggleProgramSelection(program.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {program.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {program.goal}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {program.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(program.funds)}
                        </div>
                        <div className="mt-1">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {formatCurrency(program.usedFunds)} used
                            </span>
                            <span>{Math.round(usagePercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-0.5">
                            <div
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{ width: `${usagePercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center w-fit ${statusInfo.class}`}
                      >
                        {statusInfo.icon}
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {program.responsible.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {program.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 text-gray-400" />
                        {program.period}
                      </div>
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => handleViewProgram(program.id)}
                          title="View details"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => handleEditProgram(program.id)}
                          title="Edit program"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(program)}
                          title="Delete program"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiTrendingUp size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No work programs found
            </p>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Table Footer */}
        {filteredPrograms.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredPrograms.length}</span> of{" "}
              <span className="font-medium">{workPrograms.length}</span>{" "}
              programs
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Next
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
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentProgram(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentProgram
                  ? `Are you sure you want to delete "${currentProgram.name}"? This action cannot be undone.`
                  : `Are you sure you want to delete ${selectedPrograms.length} selected programs? This action cannot be undone.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentProgram(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
