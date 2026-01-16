"use client";

import { useState } from "react";
import EventStats from "@/components/admin/pages/event/Stats";
import EventFilters from "@/components/admin/pages/event/Filters";
import EventTable from "@/components/admin/pages/event/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import HtmlRenderer from "components/admin/ui/HtmlRenderer";
import DepartmentChip from "components/admin/ui/chip/Department";
import StatusChip from "components/admin/ui/chip/Status";
import StatusApprovalChip from "components/admin/ui/chip/StatusApproval";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import ImageView from "components/admin/ui/avatar/ImageView";
import { useEventManagement } from "hooks/event/useEventManagement";
import { useResourcePermission } from "@/hooks/usePermission";

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [workProgramFilter, setWorkProgramFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    events,
    loading,
    error,
    success,
    selectedEvents,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentEvent,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentEvent,
    toggleEventSelection,
    toggleSelectAll,
    handleAddEvent,
    handleEditEvent,
    handleViewEvent,
    handleDelete,
    confirmDelete,
  } = useEventManagement();

  const { canAdd, canDelete } = useResourcePermission("events");

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
          title="Events"
          description="Manage events and their details"
        />
        {canAdd() && <AddButton onClick={handleAddEvent} text="Add Event" />}
      </div>

      <EventStats events={events} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        workProgramFilter={workProgramFilter}
        onWorkProgramFilterChange={setWorkProgramFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        selectedCount={selectedEvents.length}
        onDeleteSelected={() => handleDelete()}
        canDelete={canDelete}
      />

      <EventTable
        events={events}
        selectedEvents={selectedEvents}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onEventSelect={toggleEventSelection}
        onSelectAll={toggleSelectAll}
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDelete}
        onPageChange={setCurrentPage}
        onAddEvent={handleAddEvent}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentEvent?.name}
        selectedCount={selectedEvents.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentEvent(null);
        }}
        onConfirm={confirmDelete}
        requireGoogleDriveAuth={true}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Event Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentEvent(null);
        }}
      >
        {currentEvent && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentEvent.name}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  <DepartmentChip department={currentEvent.department} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentEvent.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentEvent.category?.name || "No category"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentEvent.period?.name || "No period"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsible
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentEvent.responsible?.name || "No responsible person"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Program
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentEvent.workProgram?.name || "No work program"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentEvent.schedules && currentEvent.schedules.length > 0
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(
                        new Date(
                          Math.min(
                            ...currentEvent.schedules.map((s) =>
                              new Date(s.date).getTime()
                            )
                          )
                        )
                      )
                    : "No schedule set"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentEvent.schedules && currentEvent.schedules.length > 0
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(
                        new Date(
                          Math.max(
                            ...currentEvent.schedules.map((s) =>
                              new Date(s.date).getTime()
                            )
                          )
                        )
                      )
                    : "No schedule set"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval
                </label>
                <div className="mt-1">
                  {currentEvent.approvals &&
                  currentEvent.approvals.length > 0 ? (
                    (() => {
                      const latestApproval = currentEvent.approvals.sort(
                        (a, b) =>
                          new Date(b.updatedAt).getTime() -
                          new Date(a.updatedAt).getTime()
                      )[0];
                      return (
                        <StatusApprovalChip status={latestApproval.status} />
                      );
                    })()
                  ) : (
                    <span className="text-xs text-gray-400">No approvals</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                  <HtmlRenderer
                    html={currentEvent.description || "No description"}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Goals
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {currentEvent.goal}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentEvent.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentEvent.updatedAt} />
                </p>
              </div>
            </div>

            {currentEvent.thumbnail && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <div className="mt-2">
                  <ImageView
                    imageUrl={currentEvent.thumbnail}
                    alt={`Event thumbnail for ${currentEvent.name}`}
                    size={{ width: 300, height: 200 }}
                    modalTitle={`Event Thumbnail - ${currentEvent.name}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </div>
  );
}
