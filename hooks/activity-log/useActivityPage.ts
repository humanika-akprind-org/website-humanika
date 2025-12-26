import { useState, useEffect } from "react";
import { type ActivityType } from "@/types/enums";
import { useActivityLog } from "@/hooks/activity-log/useActivityLog";

interface ActivityLogData {
  id: string;
  userId: string | null;
  user: {
    name: string;
  } | null;
  activityType: ActivityType;
  entityType: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useActivityPage = () => {
  const [filter, setFilter] = useState({
    activityType: "ALL",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(1);
  const [activities, setActivities] = useState<ActivityLogData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getActivityLogs } = useActivityLog();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getActivityLogs({
          activityType:
            filter.activityType === "ALL"
              ? undefined
              : (filter.activityType as ActivityType),
          startDate: filter.startDate || undefined,
          endDate: filter.endDate || undefined,
          page,
        });
        setActivities(data.activities);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [filter, page, getActivityLogs]);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    filter,
    page,
    activities,
    pagination,
    isLoading,
    handleFilterChange,
    handlePageChange,
  };
};
