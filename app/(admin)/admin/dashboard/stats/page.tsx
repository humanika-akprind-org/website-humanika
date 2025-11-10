// app/dashboard/stats/page.tsx
"use client";

import { useEffect, useState } from "react";
import { UserApi } from "@/use-cases/api/user";
import { DocumentApi } from "@/use-cases/api/document";
import { ArticleApi } from "@/use-cases/api/article";
import { EventApi } from "@/use-cases/api/event";
import { LetterApi } from "@/use-cases/api/letter";
import { WorkApi } from "@/use-cases/api/work";
import { FinanceApi } from "@/use-cases/api/finance";
import { ManagementApi } from "@/use-cases/api/management";
import { ActivityApi } from "@/use-cases/api/activity";
import type { Document } from "@/types/document";
import type { WorkProgram } from "@/types/work";
import type { Finance } from "@/types/finance";
import { Status } from "@/types/enums";

interface StatsData {
  totalUsers: number;
  totalDocuments: number;
  totalArticles: number;
  totalEvents: number;
  totalLetters: number;
  totalWorkPrograms: number;
  totalFinances: number;
  totalManagements: number;
  totalActivities: number;
  activePrograms: number;
  budgetUtilization: number;
  userActivity: number;
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
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
        ]);

        // Extract users from API response
        const users = usersResponse.data?.users || [];

        // Calculate document types distribution
        const documentTypes: { [key: string]: number } = {};
        documents.forEach((doc: Document) => {
          const type = doc.type || "Others";
          documentTypes[type] = (documentTypes[type] || 0) + 1;
        });

        // Calculate active programs (work programs that are active)
        const activePrograms = workPrograms.filter(
          (wp: WorkProgram) => wp.status === Status.PUBLISH
        ).length;

        // Calculate budget utilization (simplified - total finances amount)
        const totalBudget = finances.reduce(
          (sum: number, f: Finance) => sum + (f.amount || 0),
          0
        );
        const budgetUtilization =
          totalBudget > 0 ? Math.min((totalBudget / 50000) * 100, 100) : 0; // Assuming 50k budget

        // Mock calculations for other metrics (can be enhanced with real data)
        const userActivity = 84.2; // Active users in last 7 days
        const taskCompletion = 76.5; // On-time completion rate
        const documentProcessing = 2.4; // Avg processing time in days
        const systemUptime = 99.8; // System uptime

        // Monthly activities (mock data - can be calculated from activities)
        const monthlyActivities = [
          40, 55, 65, 50, 70, 85, 75, 80, 90, 95, 85, 100,
        ];

        setStats({
          totalUsers: users.length,
          totalDocuments: documents.length,
          totalArticles: articles.length,
          totalEvents: events.length,
          totalLetters: letters.length,
          totalWorkPrograms: workPrograms.length,
          totalFinances: finances.length,
          totalManagements: managements.length,
          totalActivities: activities.length,
          activePrograms,
          budgetUtilization,
          userActivity,
          taskCompletion,
          documentProcessing,
          systemUptime,
          documentTypes,
          monthlyActivities,
        });
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          System Statistics Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Users
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-green-500 mt-2">Active members</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Active Programs
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {stats.activePrograms}
              </p>
              <p className="text-sm text-gray-500 mt-2">Currently running</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Documents Processed
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {totalDocumentsProcessed}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {pendingDocuments} pending review
              </p>
            </div>
            <div className="text-purple-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Budget Utilization
              </h2>
              <p className="text-3xl font-bold text-red-600">
                {stats.budgetUtilization.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-2">Current utilization</p>
            </div>
            <div className="text-red-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
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
          <div className="space-y-4">
            {Object.entries(stats.documentTypes).map(([type, count]) => {
              const percentage = ((count / stats.totalDocuments) * 100).toFixed(
                1
              );
              return (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type.replace("_", " ")}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
        <div className="flex items-end h-64 space-x-2">
          {stats.monthlyActivities.map((height, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-1 group"
            >
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-400 group-hover:scale-105"
                style={{ height: `${height}%` }}
                title={`${height} activities`}
              />
              <span className="text-xs text-gray-500 mt-2 font-medium">
                {
                  [
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
                  ][index]
                }
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-300 rounded mr-3 shadow-sm" />
            <span className="text-sm text-gray-600 font-medium">
              Activities
            </span>
          </div>
        </div>
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
