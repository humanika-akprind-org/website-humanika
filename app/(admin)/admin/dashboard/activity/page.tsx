// app/dashboard/activity/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash,
  Lock,
  LogOut,
  Check,
  X,
  Upload,
  Download,
  FileText,
  BarChart3,
  RefreshCw,
  User,
} from "lucide-react";

import type { ActivityLog } from "@/types/activity-log";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import ExportButtons from "@/components/admin/activity/export-button/ExportButtons";
import LoadingActivityDashboard from "@/components/admin/activity/LoadingActivityDashboard";
import StatCard from "@/components/admin/ui/card/StatCard";

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("All");
  const [selectedTimeFilter, setSelectedTimeFilter] =
    useState("All Activities");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = async (page = 1, append = false) => {
    try {
      const response = await fetch(
        `/api/system/activity?page=${page}&limit=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const result = await response.json();
      const newActivities = result.activities || [];

      if (append) {
        setActivities((prev) => [...prev, ...newActivities]);
      } else {
        setActivities(newActivities);
      }

      setHasMore(page < result.pagination.totalPages);
      setCurrentPage(page);

      if (!append) {
        setFilteredActivities(newActivities);
      }
    } catch (err) {
      setError("Failed to load activities");
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = activities;

    // Service filter
    if (selectedService !== "All") {
      filtered = filtered.filter(
        (activity) => getServiceName(activity.entityType) === selectedService
      );
    }

    // Time filter
    if (selectedTimeFilter !== "All Activities") {
      const now = new Date();
      let startDate: Date;

      switch (selectedTimeFilter) {
        case "Today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "This Week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "This Month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0); // All time
      }

      filtered = filtered.filter(
        (activity) => new Date(activity.createdAt) >= startDate
      );
    }

    setFilteredActivities(filtered);
  }, [activities, selectedService, selectedTimeFilter]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      await fetchActivities(currentPage + 1, true);
    } finally {
      setLoadingMore(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "CREATE":
        return <Plus className="h-5 w-5 text-green-500" />;
      case "UPDATE":
        return <Edit className="h-5 w-5 text-blue-500" />;
      case "DELETE":
        return <Trash className="h-5 w-5 text-red-500" />;
      case "LOGIN":
        return <Lock className="h-5 w-5 text-purple-500" />;
      case "LOGOUT":
        return <LogOut className="h-5 w-5 text-gray-500" />;
      case "APPROVE":
        return <Check className="h-5 w-5 text-green-500" />;
      case "REJECT":
        return <X className="h-5 w-5 text-red-500" />;
      case "UPLOAD":
        return <Upload className="h-5 w-5 text-blue-500" />;
      case "DOWNLOAD":
        return <Download className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getServiceName = (entityType: string) => {
    switch (entityType) {
      case "USER":
        return "Users";
      case "WORK_PROGRAM":
        return "Work Programs";
      case "EVENT":
        return "Events";
      case "DOCUMENT":
        return "Documents";
      case "LETTER":
        return "Letter";
      case "ARTICLE":
        return "Article";
      case "GALLERY":
        return "Gallery";
      case "FINANCE":
        return "Finance";
      case "APPROVAL":
        return "Approvals";
      case "PERIOD":
        return "Period";
      case "STRUCTURE":
        return "Structure";
      case "TASK":
        return "Task";
      default:
        return entityType;
    }
  };

  const getPriority = (activityType: string) => {
    switch (activityType) {
      case "DELETE":
      case "APPROVE":
      case "REJECT":
        return "high";
      case "CREATE":
      case "UPDATE":
        return "medium";
      default:
        return "low";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    }
    if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  if (loading) {
    return <LoadingActivityDashboard />;
  }

  if (error) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const serviceFilters = [
    "All",
    "Users",
    "Work Programs",
    "Events",
    "Documents",
    "Letter",
    "Article",
    "Gallery",
    "Links",
    "Finance",
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 py-1">Activity Log</h1>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 py-1">
          <SelectInput
            label=""
            name="selectedTimeFilter"
            value={selectedTimeFilter}
            onChange={setSelectedTimeFilter}
            options={[
              { value: "All Activities", label: "All Activities" },
              { value: "Today", label: "Today" },
              { value: "This Week", label: "This Week" },
              { value: "This Month", label: "This Month" },
            ]}
            placeholder="Select time filter"
            className="w-auto"
          />
          <ExportButtons activities={filteredActivities} />
        </div>
      </div>

      {/* Service Filters */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Filter by Service
        </h2>
        <div className="flex flex-wrap gap-2">
          {serviceFilters.map((service) => (
            <button
              key={service}
              onClick={() => setSelectedService(service)}
              className={`px-3 py-1 rounded-full transition-colors ${
                selectedService === service
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {(() => {
          const thisWeekCount = activities.filter((activity) => {
            const activityDate = new Date(activity.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate >= weekAgo;
          }).length;

          const userCounts = filteredActivities.reduce((acc, activity) => {
            const userName = activity.user?.name || "Unknown";
            acc[userName] = (acc[userName] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const mostActive = Object.entries(userCounts).sort(
            ([, a], [, b]) => b - a
          )[0];

          const serviceCounts = filteredActivities.reduce((acc, activity) => {
            const serviceName = getServiceName(activity.entityType);
            acc[serviceName] = (acc[serviceName] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const topService = Object.entries(serviceCounts).sort(
            ([, a], [, b]) => b - a
          )[0];

          const stats = [
            {
              title: "Total Activities",
              value: filteredActivities.length,
              icon: BarChart3,
              color: "blue",
            },
            {
              title: "This Week",
              value: thisWeekCount,
              icon: RefreshCw,
              color: "green",
            },
            {
              title: "Most Active",
              value: mostActive ? mostActive[0] : "No data",
              icon: User,
              color: "purple",
            },
            {
              title: "Top Service",
              value: topService ? topService[0] : "No data",
              icon: FileText,
              color: "orange",
            },
          ];

          return stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ));
        })()}
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Activities
          </h2>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <li
              key={activity.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user?.name || "Unknown User"}
                        <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {getServiceName(activity.entityType)}
                        </span>
                        {getPriority(activity.activityType) === "high" && (
                          <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                            Important
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Activities"
              )}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">No more activities to load</p>
          )}
        </div>
      </div>
    </div>
  );
}
