import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityType } from "@/types/enums";
import type { ActivityType as PrismaActivityType } from "@prisma/client";

interface ActivityLogData {
  id: string;
  userId: string | null;
  user: {
    name: string;
  } | null;
  activityType: PrismaActivityType;
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

interface TableProps {
  activities: ActivityLogData[];
  pagination: PaginationData | null;
  page: number;
  onPageChange: (page: number) => void;
}

export default function ActivityTable({
  activities,
  pagination,
  page,
  onPageChange,
}: TableProps) {
  const getActivityTypeColor = (type: PrismaActivityType) => {
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
    return colors[type as ActivityType] || "text-gray-600";
  };

  const generatePageNumbers = (
    currentPage: number,
    totalPages: number
  ): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2; // show 2 pages before and after current

    if (totalPages <= 7) {
      // If total pages are small, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of the range around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      // Add ellipsis if there's a gap after first page
      if (start > 2) {
        pages.push("...");
      }

      // Add pages in the range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if there's a gap before last page
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page if more than 1
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
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
              <TableCell>{activity.user?.name || "System"}</TableCell>
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
            {generatePageNumbers(page, pagination.totalPages).map((p, index) =>
              p === "..." ? (
                <span key={index} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => onPageChange(p as number)}
                  disabled={p === page}
                >
                  {p}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
