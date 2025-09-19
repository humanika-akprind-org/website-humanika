"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPlus,
} from "react-icons/fi";
import type { WorkProgram } from "@/types/work";
import type { Department } from "@/types/enums";
import { Status } from "@/types/enums";
import DeleteModal from "./modal/DeleteModal";
import Stats from "./Stats";
import Filters from "./Filters";

interface WorkProgramTableProps {
  workPrograms: WorkProgram[];
  onDelete: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
}

export default function WorkProgramTable({
  workPrograms,
  onDelete,
  onDeleteMultiple,
}: WorkProgramTableProps) {
  const router = useRouter();
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "all">(
    "all"
  );
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [isActiveFilter, setIsActiveFilter] = useState<"all" | "active" | "inactive">("all");
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
      periodFilter === "all" || program.period.name === periodFilter;
    const matchesIsActive =
      isActiveFilter === "all" ||
      (isActiveFilter === "active" && program.period.isActive) ||
      (isActiveFilter === "inactive" && !program.period.isActive);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDepartment &&
      matchesPeriod &&
      matchesIsActive
    );
  });

  // Filter out programs with invalid IDs
  const validPrograms = filteredPrograms.filter((program) =>
    program.id && typeof program.id === 'string' && program.id.trim() !== '' && program.id !== 'undefined'
  );

  // Toggle program selection
  const toggleProgramSelection = (id: string) => {
    if (!id || typeof id !== 'string' || id.trim() === '' || id === 'undefined') {
      console.warn('Attempted to select invalid program ID:', id);
      return;
    }
    if (selectedPrograms.includes(id)) {
      setSelectedPrograms(selectedPrograms.filter((programId) => programId !== id));
    } else {
      setSelectedPrograms([...selectedPrograms, id]);
    }
  };

  // Select all programs on current page
  const toggleSelectAll = () => {
    if (selectedPrograms.length === validPrograms.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(validPrograms.map((program) => program.id));
    }
  };

  // Navigate to add work program page
  const handleAddProgram = () => {
    router.push("/admin/programs/works/add");
  };

  // Navigate to edit work program page
  const handleEditProgram = (id: string) => {
    router.push(`/admin/programs/works/edit/${id}`);
  };

  // Navigate to view work program page
  const handleViewProgram = (id: string) => {
    router.push(`/admin/programs/works/${id}`);
  };

  // Delete program(s)
  const handleDelete = (program?: WorkProgram) => {
    setCurrentProgram(program || null);
    setShowDeleteModal(true);
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentProgram) {
      // Validate single program ID
      if (currentProgram.id && typeof currentProgram.id === 'string' && currentProgram.id.trim() !== '' && currentProgram.id !== 'undefined') {
        onDelete(currentProgram.id);
      } else {
        console.warn('Attempted to delete program with invalid ID:', currentProgram.id);
      }
    } else if (selectedPrograms.length > 0) {
      // Filter out invalid IDs and log if any invalid found
      const validIds = selectedPrograms.filter(
        (id) => id && typeof id === "string" && id.trim() !== "" && id !== "undefined"
      );
      if (validIds.length !== selectedPrograms.length) {
        console.warn(
          "Some selected program IDs are invalid and will be ignored:",
          selectedPrograms.filter((id) => !validIds.includes(id))
        );
      }
      if (validIds.length > 0) {
        onDeleteMultiple(validIds);
      }
      setSelectedPrograms([]); // Clear selection after bulk delete
    }
    setShowDeleteModal(false);
    setCurrentProgram(null);
  };

  // Get status badge class and icon
  const getStatusInfo = (status: Status) => {
    switch (status) {
      case Status.DRAFT:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiClock className="mr-1" />,
          text: "Draft",
        };
      case Status.PENDING:
        return {
          class: "bg-blue-100 text-blue-800",
          icon: <FiAlertCircle className="mr-1" />,
          text: "Pending",
        };
      case Status.APPROVED:
        return {
          class: "bg-green-100 text-green-800",
          icon: <FiCheckCircle className="mr-1" />,
          text: "Approved",
        };
      case Status.REJECTED:
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiXCircle className="mr-1" />,
          text: "Rejected",
        };
      case Status.COMPLETED:
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
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  // Calculate usage percentage
  const calculateUsagePercentage = (used: number, total: number) => {
    if (total === 0) return 0;
    return (used / total) * 100;
  };

  // Get departments from work programs
  // const departments = Array.from(
  //   new Set(workPrograms.map((program) => program.department))
  // );

  // Get periods from work programs
  const periods = Array.from(
    new Set(workPrograms.map((program) => program.period.name))
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
      <Stats workPrograms={workPrograms} />

      {/* Filters and Search */}
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        isActiveFilter={isActiveFilter}
        setIsActiveFilter={setIsActiveFilter}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        periods={periods}
        selectedPrograms={selectedPrograms}
        handleDelete={handleDelete}
      />

      {/* Work Programs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      validPrograms.length > 0 &&
                      selectedPrograms.length === validPrograms.length
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
                  style={{ width: "300px", minWidth: "300px" }}
                >
                  Goal
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
              {validPrograms.map((program) => {
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
                      <div className="text-sm font-medium text-gray-900">
                        {program.name}
                      </div>
                    </td>
                    <td className="px-4 py-4" style={{ width: "300px", minWidth: "300px" }}>
                      <div className="text-sm text-gray-600 break-words">
                        {program.goal}
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
                            />
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
                            {program.responsible.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 text-gray-400" />
                        {program.period.name}
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

        {validPrograms.length === 0 && (
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
        {validPrograms.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{validPrograms.length}</span> of{" "}
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
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentProgram(null);
        }}
        onConfirm={confirmDelete}
        program={currentProgram}
        selectedCount={selectedPrograms.length}
      />
    </div>
  );
}
