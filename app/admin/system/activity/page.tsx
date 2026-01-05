"use client";

import LoadingActivity from "@/components/admin/layout/loading/LoadingActivity";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import ActivityFilters from "@/components/admin/pages/activity/Filters";
import ActivityTable from "@/components/admin/pages/activity/Table";
import { useActivityPage } from "@/hooks/activity-log/useActivityPage";

export default function ActivityLogPage() {
  const {
    filter,
    page,
    activities,
    pagination,
    isLoading,
    handleFilterChange,
    handlePageChange,
  } = useActivityPage();

  if (isLoading) {
    return <LoadingActivity />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <ManagementHeader
          title="Activity Log"
          description="View and monitor system activities"
        />
      </div>

      <ActivityFilters filter={filter} onFilterChange={handleFilterChange} />

      <ActivityTable
        activities={activities}
        pagination={pagination}
        page={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
