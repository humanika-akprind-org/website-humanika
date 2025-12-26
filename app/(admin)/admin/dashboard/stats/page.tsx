// app/dashboard/stats/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
} from "recharts";
import { UserApi } from "@/use-cases/api/user";
import { DocumentApi } from "@/use-cases/api/document";
import { ArticleApi } from "@/use-cases/api/article";
import { EventApi } from "@/use-cases/api/event";
import { LetterApi } from "@/use-cases/api/letter";
import { WorkApi } from "@/use-cases/api/work";
import { FinanceApi } from "@/use-cases/api/finance";
import { ManagementApi } from "@/use-cases/api/management";
import { ActivityApi } from "@/use-cases/api/activity";
import { GalleryApi } from "@/use-cases/api/gallery";

import type { Document } from "@/types/document";
import type { WorkProgram } from "@/types/work";
import type { Finance } from "@/types/finance";
import { Status } from "@/types/enums";

interface StatsData {
  // User Stats
  totalUsers: number;
  activeUsers: number;
  userActivity: number;

  // Administration Stats
  totalProposals: number;
  totalAccountabilityReports: number;
  activePrograms: number;

  // Letter Stats
  totalLetters: number;
  incomingLetters: number;
  outgoingLetters: number;

  // Public Content Stats
  totalArticles: number;
  totalEvents: number;
  totalGalleries: number;

  // Finance Stats
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  budgetUtilization: number;
  totalBudget: number;

  // System Stats
  totalDocuments: number;
  totalWorkPrograms: number;
  totalManagements: number;
  totalActivities: number;
  taskCompletion: number;
  documentProcessing: number;
  systemUptime: number;
  documentTypes: { [key: string]: number };
  monthlyActivities: number[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [
        usersResponse,
        documents,
        articles,
        events,
        letters,
        workPrograms,
        finances,
        managements,
        activities,
        galleries,
      ] = await Promise.all([
        UserApi.getUsers(),
        DocumentApi.getDocuments(),
        ArticleApi.getArticles(),
        EventApi.getEvents(),
        LetterApi.getLetters(),
        WorkApi.getWorkPrograms(),
        FinanceApi.getFinances(),
        ManagementApi.getManagements(),
        ActivityApi.getActivities(),
        GalleryApi.getGalleries(),
      ]);

      // Extract users from API response
      const users = usersResponse.data?.users || [];

      // Calculate document types distribution
      const documentTypes: { [key: string]: number } = {};
      documents.forEach((doc: Document) => {
        const type = doc.type || "Others";
        documentTypes[type] = (documentTypes[type] || 0) + 1;
      });

      // Calculate administration stats (proposals and accountability reports)
      const totalProposals = documents.filter((doc: Document) =>
        doc.type?.toLowerCase().includes("proposal")
      ).length;
      const totalAccountabilityReports = documents.filter((doc: Document) =>
        doc.type?.toLowerCase().includes("accountability")
      ).length;

      // Calculate letter stats (incoming and outgoing)
      const incomingLetters = letters.filter(
        (letter: any) => letter.type === "INCOMING"
      ).length;
      const outgoingLetters = letters.filter(
        (letter: any) => letter.type === "OUTGOING"
      ).length;

      // Calculate finance stats (income and expense)
      const totalIncome = finances
        .filter((f: Finance) => f.type === "INCOME")
        .reduce((sum: number, f: Finance) => sum + (f.amount || 0), 0);
      const totalExpense = finances
        .filter((f: Finance) => f.type === "EXPENSE")
        .reduce((sum: number, f: Finance) => sum + (f.amount || 0), 0);
      const netIncome = totalIncome - totalExpense;

      // Calculate active programs (work programs that are active)
      const activePrograms = workPrograms.filter(
        (wp: WorkProgram) => wp.status === Status.PUBLISH
      ).length;

      // Calculate budget utilization (simplified - total finances amount)
      const budgetUtilization =
        totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;
      const totalBudget = totalIncome + totalExpense;

      // Calculate active users (mock calculation based on user activity)
      const userActivity = 84.2; // Active users in last 7 days
      const activeUsers = Math.round(users.length * (userActivity / 100));

      // Mock calculations for other metrics (can be enhanced with real data)
      const taskCompletion = 76.5; // On-time completion rate
      const documentProcessing = 2.4; // Avg processing time in days
      const systemUptime = 99.8; // System uptime

      // Monthly activities (mock data - can be calculated from activities)
      const monthlyActivities = [
        40, 55, 65, 50, 70, 85, 75, 80, 90, 95, 85, 100,
      ];

      setStats({
        // User Stats
        totalUsers: users.length,
        activeUsers,
        userActivity,

        // Administration Stats
        totalProposals,
        totalAccountabilityReports,
        activePrograms,

        // Letter Stats
        totalLetters: letters.length,
        incomingLetters,
        outgoingLetters,

        // Public Content Stats
        totalArticles: articles.length,
        totalEvents: events.length,
        totalGalleries: galleries.length,

        // Finance Stats
        totalIncome,
        totalExpense,
        netIncome,
        budgetUtilization,
        totalBudget,

        // System Stats
        totalDocuments: documents.length,
        totalWorkPrograms: workPrograms.length,
        totalManagements: managements.length,
        totalActivities: activities.length,
        taskCompletion,
        documentProcessing,
        systemUptime,
        documentTypes,
        monthlyActivities,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
  };

  const handleExport = () => {
    // Simple export functionality - in a real app, you'd use a library like jsPDF
    const data = {
      stats,
      exportedAt: new Date().toISOString(),
      lastUpdated: lastUpdated.toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-stats-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-300 rounded" />
            <div className="h-64 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const totalDocumentsProcessed = stats.totalDocuments;
  const pendingDocuments = Math.floor(stats.totalDocuments * 0.05); // Assume 5% pending

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          System Statistics Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Active / Total</p>
              <p className="text-xs text-blue-600 font-medium">
                {stats.activeUsers} / {stats.totalUsers}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalUsers}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.userActivity}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.userActivity}% active
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Active / Total</p>
              <p className="text-xs text-green-600 font-medium">
                {stats.activePrograms} / {stats.totalWorkPrograms}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Active Programs
            </h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {stats.activePrograms}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    stats.totalWorkPrograms > 0
                      ? (stats.activePrograms / stats.totalWorkPrograms) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of {stats.totalWorkPrograms} total programs
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Processed / Pending</p>
              <p className="text-xs text-purple-600 font-medium">
                {totalDocumentsProcessed - pendingDocuments} /{" "}
                {pendingDocuments}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Document Management
            </h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">
              {totalDocumentsProcessed}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    totalDocumentsProcessed > 0
                      ? ((totalDocumentsProcessed - pendingDocuments) /
                          totalDocumentsProcessed) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(
                ((totalDocumentsProcessed - pendingDocuments) /
                  totalDocumentsProcessed) *
                100
              ).toFixed(1)}
              % processed
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-xs text-red-600 font-medium">
                Rp {stats.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Budget Utilization
            </h3>
            <p className="text-3xl font-bold text-red-600 mb-2">
              {stats.budgetUtilization.toFixed(1)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.budgetUtilization}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">of allocated budget</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Document Types Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(stats.documentTypes).map(
                  ([type, count]) => ({
                    name: type.replace("_", " "),
                    value: count,
                    percentage: ((count / stats.totalDocuments) * 100).toFixed(
                      1
                    ),
                  })
                )}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(stats.documentTypes).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#3b82f6",
                        "#10b981",
                        "#8b5cf6",
                        "#f59e0b",
                        "#ef4444",
                        "#06b6d4",
                        "#84cc16",
                      ][index % 7]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} documents`, name]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(stats.documentTypes).map(([type, count], index) => (
              <div key={type} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: [
                      "#3b82f6",
                      "#10b981",
                      "#8b5cf6",
                      "#f59e0b",
                      "#ef4444",
                      "#06b6d4",
                      "#84cc16",
                    ][index % 7],
                  }}
                />
                <span className="capitalize">{type.replace("_", " ")}</span>
                <span className="ml-auto font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            System Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">User Activity</p>
              <p className="text-2xl font-bold text-blue-700">
                {stats.userActivity}%
              </p>
              <p className="text-xs text-blue-600">Active in last 7 days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium">
                Task Completion
              </p>
              <p className="text-2xl font-bold text-green-700">
                {stats.taskCompletion}%
              </p>
              <p className="text-xs text-green-600">On-time completion rate</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">
                Document Processing
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.documentProcessing} days
              </p>
              <p className="text-xs text-purple-600">Avg. processing time</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium">System Uptime</p>
              <p className="text-2xl font-bold text-red-700">
                {stats.systemUptime}%
              </p>
              <p className="text-xs text-red-600">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activities Chart */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Monthly Activities
          </h2>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>Year to date</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={stats.monthlyActivities.map((value, index) => ({
              month: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][index],
              activities: value,
            }))}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} activities`, "Activities"]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="activities" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* System Performance Trends */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            System Performance Trends
          </h2>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { month: "Jan", uptime: 99.8, activity: 84.2, completion: 76.5 },
              { month: "Feb", uptime: 99.9, activity: 85.1, completion: 78.2 },
              { month: "Mar", uptime: 99.7, activity: 83.8, completion: 75.9 },
              { month: "Apr", uptime: 99.8, activity: 86.3, completion: 79.1 },
              { month: "May", uptime: 99.9, activity: 87.2, completion: 80.5 },
              { month: "Jun", uptime: 99.8, activity: 85.9, completion: 77.8 },
            ]}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="#10b981"
              strokeWidth={3}
              name="System Uptime (%)"
            />
            <Line
              type="monotone"
              dataKey="activity"
              stroke="#3b82f6"
              strokeWidth={3}
              name="User Activity (%)"
            />
            <Line
              type="monotone"
              dataKey="completion"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Task Completion (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Service Usage Statistics */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Service Usage Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalDocuments}
            </div>
            <div className="text-sm text-gray-600 font-medium">Documents</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalWorkPrograms}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Work Programs
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.totalEvents}
            </div>
            <div className="text-sm text-gray-600 font-medium">Events</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.totalArticles}
            </div>
            <div className="text-sm text-gray-600 font-medium">Articles</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.totalLetters}
            </div>
            <div className="text-sm text-gray-600 font-medium">Letters</div>
          </div>
        </div>
      </div>
    </div>
  );
}
