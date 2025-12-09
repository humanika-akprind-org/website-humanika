"use client";

import { useState } from "react";
import EventStats from "@/components/admin/event/Stats";
import EventFilters from "@/components/admin/event/Filters";
import EventTable from "@/components/admin/event/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import { useEventManagement } from "@/hooks/event/useEventManagement";

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [workProgramFilter, setWorkProgramFilter] = useState("all");

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
        <AddButton onClick={handleAddEvent} text="Add Event" />
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
        selectedCount={selectedEvents.length}
        onDeleteSelected={() => handleDelete()}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">{currentEvent.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentEvent.department || "No department"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentEvent.status}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(currentEvent.startDate))}{" "}
                -{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(currentEvent.endDate))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                <HtmlRenderer
                  html={currentEvent.description || "No description"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(currentEvent.createdAt))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Updated At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(currentEvent.updatedAt))}
              </p>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
