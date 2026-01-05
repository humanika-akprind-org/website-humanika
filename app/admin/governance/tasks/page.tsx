"use client";

import TaskStats from "@/components/admin/pages/task/Stats";
import TaskFilters from "@/components/admin/pages/task/Filters";
import TaskTable from "@/components/admin/pages/task/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import DepartmentChip from "@/components/admin/ui/chip/Department";
import StatusChip from "@/components/admin/ui/chip/Status";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
import { useTaskManagement } from "@/hooks/task/useTaskManagement";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";

export default function TasksPage() {
  const {
    tasks,
    loading,
    error,
    success,
    selectedTasks,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentTask,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentTask,
    toggleTaskSelection,
    toggleSelectAll,
    handleViewTask,
    handleAddTask,
    handleEditTask,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  } = useTaskManagement();

  const alert: { type: AlertType; message: string } | null = error
    ? { type: "error", message: error }
    : success
    ? { type: "success", message: success }
    : null;

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <ManagementHeader
          title="Task Management"
          description="Manage all department tasks and assignments"
        />
        <AddButton onClick={handleAddTask} text="Add Task" />
      </div>

      <TaskStats tasks={tasks} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <TaskFilters
        filters={filters}
        searchTerm={searchTerm}
        selectedTasks={selectedTasks}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
      />

      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTasks}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onTaskSelect={toggleTaskSelection}
        onSelectAll={toggleSelectAll}
        onViewTask={handleViewTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDelete}
        onPageChange={setCurrentPage}
        onAddTask={handleAddTask}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentTask?.title}
        selectedCount={selectedTasks.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentTask(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Task Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentTask(null);
        }}
      >
        {currentTask && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentTask.title}
                </h4>
                <p className="text-gray-600">{currentTask.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  <DepartmentChip department={currentTask.department} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentTask.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned User
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentTask.user?.name || "Unassigned"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Program
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentTask.workProgram?.name || "No Program"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Task Note
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                  <HtmlRenderer html={currentTask.note} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentTask.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentTask.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
