import { useState } from "react";
import Link from "next/link";
import { FiCheckCircle, FiUser, FiEye, FiFolder } from "react-icons/fi";
import type { DepartmentTask } from "@/types/task";
import type { Status } from "@/types/enums";
import { Status as StatusEnum } from "@/types/enums";
import TaskStats from "./Stats";
import TaskFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";
import PreviewModal from "./modal/PreviewModal";

interface TaskTableProps {
  tasks: DepartmentTask[];
  onDelete: (id: string) => void;
}

export default function TaskTable({ tasks, onDelete }: TaskTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<DepartmentTask | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [taskToPreview, setTaskToPreview] = useState<DepartmentTask | null>(
    null
  );

  const handleStatusFilterChange = (status: string) =>
    (status === "all" ||
      Object.values(StatusEnum).includes(status as unknown as StatusEnum)) &&
    setStatusFilter(status === "all" ? "all" : (status as unknown as Status));

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.PUBLISH:
        return "bg-green-100 text-green-800";
      case StatusEnum.PRIVATE:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.ARCHIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (task: DepartmentTask) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedTasks.forEach((id) => onDelete(id));
      setSelectedTasks([]);
    } else if (taskToDelete) {
      onDelete(taskToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
    setIsBulkDelete(false);
  };

  const handlePreview = (task: DepartmentTask) => {
    setTaskToPreview(task);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setTaskToPreview(null);
  };

  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.workProgram?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "all" || task.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Toggle task selection
  const toggleTaskSelection = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return;

    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first department task.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      <TaskStats tasks={filteredTasks} />

      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter.toString()}
        onStatusFilterChange={handleStatusFilterChange}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        selectedCount={selectedTasks.length}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>

        {selectedTasks.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedTasks.length} task
              {selectedTasks.length > 1 ? "s" : ""} selected
            </span>
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
                    onChange={() => {
                      if (selectedTasks.length === filteredTasks.length) {
                        setSelectedTasks([]);
                      } else {
                        setSelectedTasks(filteredTasks.map((task) => task.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subtitle
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Task Note
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: "250px", minWidth: "250px" }}
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assigned User
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
                  Work Program
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
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
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
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
                      <div className="text-sm text-gray-900 font-medium">
                        {task.title}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {task.subtitle || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {task.note.length > 50
                          ? `${task.note
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 50)}...`
                          : task.note.replace(/<[^>]*>/g, "")}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ width: "250px", minWidth: "250px" }}
                    >
                      <div className="text-sm text-gray-600">
                        {task.department}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" size={14} />
                        {task.user?.name || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiFolder className="mr-2 text-gray-400" size={14} />
                        {task.workProgram?.name || "No Program"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(task.createdAt)}
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => handlePreview(task)}
                          title="Preview task"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/governance/tasks/edit/${task.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit task"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(task)}
                          title="Delete task"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No tasks found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {tasks.length === 0
                        ? "Get started by creating your first department task."
                        : "No tasks match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredTasks.length}</span> of{" "}
              <span className="font-medium">{tasks.length}</span> tasks
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        taskName={taskToDelete?.note || ""}
        count={isBulkDelete ? selectedTasks.length : 1}
        isLoading={false}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        task={taskToPreview}
      />
    </div>
  );
}
