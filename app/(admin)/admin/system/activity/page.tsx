"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityType } from "@/types/enums";
import { useActivityLog } from "@/hooks/activity-log/useActivityLog";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

interface ActivityLogData {
  id: string;
  userId: string;
  user: {
    name: string;
  };
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

export default function ActivityLogPage() {
  const [filter, setFilter] = useState({
    activityType: "ALL",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(1);
  const [activities, setActivities] = useState<ActivityLogData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getActivityLogs } = useActivityLog();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
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
        setError("Failed to fetch activity logs");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [filter, page, getActivityLogs]);

  const getActivityTypeColor = (type: ActivityType) => {
    const colors = {
      [ActivityType.CREATE]: "text-green-600",
      [ActivityType.UPDATE]: "text-blue-600",
      [ActivityType.DELETE]: "text-red-600",
      [ActivityType.LOGIN]: "text-purple-600",
      [ActivityType.LOGOUT]: "text-gray-600",
      [ActivityType.APPROVE]: "text-emerald-600",
      [ActivityType.REJECT]: "text-rose-600",
      [ActivityType.UPLOAD]: "text-amber-600",
      [ActivityType.DOWNLOAD]: "text-cyan-600",
      [ActivityType.OTHER]: "text-slate-600",
    };
    return colors[type] || "text-gray-600";
  };

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Activity Log</h1>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              className="border rounded-md p-2"
              value={filter.activityType}
              onChange={(e) => {
                setFilter({ ...filter, activityType: e.target.value });
                setPage(1); // Reset page when filter changes
              }}
            >
              <option value="ALL">All Activities</option>
              {Object.values(ActivityType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border rounded-md p-2"
              value={filter.startDate}
              onChange={(e) => {
                setFilter({ ...filter, startDate: e.target.value });
                setPage(1);
              }}
            />

            <input
              type="date"
              className="border rounded-md p-2"
              value={filter.endDate}
              onChange={(e) => {
                setFilter({ ...filter, endDate: e.target.value });
                setPage(1);
              }}
            />
          </div>

          {/* Activity Table */}
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(activity.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{activity.user.name}</TableCell>
                      <TableCell
                        className={getActivityTypeColor(activity.activityType)}
                      >
                        {activity.activityType}
                      </TableCell>
                      <TableCell>{activity.entityType}</TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>{activity.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
