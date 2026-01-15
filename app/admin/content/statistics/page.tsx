"use client";

import StatisticStats from "@/components/admin/pages/statistic/Stats";
import StatisticFilters from "@/components/admin/pages/statistic/Filters";
import StatisticTable from "@/components/admin/pages/statistic/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import { useStatisticManagement } from "hooks/statistic/useStatisticManagement";

export default function StatisticsPage() {
  const {
    statistics,
    loading,
    error,
    success,
    selectedStatistics,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentStatistic,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentStatistic,
    toggleStatisticSelection,
    toggleSelectAll,
    handleAddStatistic,
    handleEditStatistic,
    handleViewStatistic,
    handleDelete,
    confirmDelete,
  } = useStatisticManagement();

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
          title="Statistics"
          description="Manage organization statistics"
        />
        <AddButton onClick={handleAddStatistic} text="Add Statistic" />
      </div>

      <StatisticStats statistics={statistics} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <StatisticFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedStatistics.length}
        onDeleteSelected={() => handleDelete()}
      />

      <StatisticTable
        statistics={statistics}
        selectedStatistics={selectedStatistics}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onStatisticSelect={toggleStatisticSelection}
        onSelectAll={toggleSelectAll}
        onViewStatistic={handleViewStatistic}
        onEditStatistic={handleEditStatistic}
        onDeleteStatistic={handleDelete}
        onPageChange={setCurrentPage}
        onAddStatistic={handleAddStatistic}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentStatistic?.id}
        selectedCount={selectedStatistics.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentStatistic(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Statistic Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentStatistic(null);
        }}
      >
        {currentStatistic && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Active Members
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.activeMembers}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Annual Events
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.annualEvents}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Collaborative Projects
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.collaborativeProjects}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Innovation Projects
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.innovationProjects}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Awards
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.awards}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Member Satisfaction
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.memberSatisfaction}%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Learning Materials
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStatistic.learningMaterials}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentStatistic.createdAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
