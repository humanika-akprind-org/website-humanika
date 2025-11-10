"use client";

import { useEffect, useState } from "react";
import { UserApi } from "@/use-cases/api/user";
import { DocumentApi } from "@/use-cases/api/document";
import { ArticleApi } from "@/use-cases/api/article";
import { EventApi } from "@/use-cases/api/event";
import { LetterApi } from "@/use-cases/api/letter";
import { WorkApi } from "@/use-cases/api/work";
import { FinanceApi } from "@/use-cases/api/finance";

import { ApprovalApi } from "@/use-cases/api/approval";
import { PeriodApi } from "@/use-cases/api/period";

import { ActivityApi } from "@/use-cases/api/activity";
import type { Document } from "@/types/document";
import type { WorkProgram } from "@/types/work";
import type { Finance } from "@/types/finance";
import type { Event } from "@/types/event";
import type { Article } from "@/types/article";

import type { ActivityLog } from "@/types/activity-log";
import type { Period } from "@/types/period";
import { Status } from "@/types/enums";

interface OverviewData {
  totalUsers: number;
  totalWorkPrograms: number;
  upcomingEvents: number;
  totalDocuments: number;
  totalBudget: number;
  processedLetters: number;
  publishedArticles: number;
  galleryItems: number;
  pendingDocuments: number;
  activePrograms: number;
  pendingApprovals: number;
  activePeriod: string;
  recentActivities: ActivityLog[];
  nextEvent?: Event;
}

export default function OverviewPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [
          usersResponse,
          documents,
          articles,
          events,
          letters,
          workPrograms,
          finances,
          galleries,
          approvalsResponse,
          periods,
          activities,
        ] = await Promise.all([
          UserApi.getUsers(),
          DocumentApi.getDocuments(),
          ArticleApi.getArticles(),
          EventApi.getEvents(),
          LetterApi.getLetters(),
          WorkApi.getWorkPrograms(),
          FinanceApi.getFinances(),
          [],
          ApprovalApi.getApprovals({ status: "PENDING" }),
          PeriodApi.getPeriods(),
          ActivityApi.getActivities(),
        ]);

        // Extract users from API response
        const users = usersResponse.data?.users || [];

        // Calculate metrics
        const totalUsers = users.length;
        const totalWorkPrograms = workPrograms.length;
        const totalDocuments = documents.length;
        const processedLetters = letters.length;
        const galleryItems = galleries.length;

        // Calculate upcoming events (events with future dates)
        const now = new Date();
        const upcomingEvents = events.filter((event: Event) => {
          const eventDate = new Date(event.startDate);
          return eventDate > now;
        }).length;

        // Find next upcoming event
        const nextEvent = events
          .filter((event: Event) => new Date(event.startDate) > now)
          .sort(
            (a: Event, b: Event) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )[0];

        // Calculate total budget (net balance: income - expense)
        const totalIncome = finances
          .filter((finance: Finance) => finance.type === "INCOME")
          .reduce(
            (sum: number, finance: Finance) => sum + (finance.amount || 0),
            0
          );
        const totalExpense = finances
          .filter((finance: Finance) => finance.type === "EXPENSE")
          .reduce(
            (sum: number, finance: Finance) => sum + (finance.amount || 0),
            0
          );
        const totalBudget = totalIncome - totalExpense;

        // Calculate published articles
        const publishedArticles = articles.filter(
          (article: Article) => article.status === Status.PUBLISH
        ).length;

        // Calculate active programs
        const activePrograms = workPrograms.filter(
          (wp: WorkProgram) => wp.status === Status.PUBLISH
        ).length;

        // Calculate pending documents (documents with pending status)
        const pendingDocuments = documents.filter(
          (doc: Document) => doc.status === Status.PENDING
        ).length;

        // Get pending approvals count
        const pendingApprovals = approvalsResponse.data?.pagination?.total || 0;

        // Get active period
        const activePeriod =
          periods.find((period: Period) => period.isActive)?.name ||
          "No active period";

        // Get recent activities (last 3)
        const recentActivities = activities
          .sort(
            (a: ActivityLog, b: ActivityLog) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        setOverview({
          totalUsers,
          totalWorkPrograms,
          upcomingEvents,
          totalDocuments,
          totalBudget,
          processedLetters,
          publishedArticles,
          galleryItems,
          pendingDocuments,
          activePrograms,
          pendingApprovals,
          activePeriod,
          recentActivities,
          nextEvent,
        });
      } catch (err) {
        setError("Failed to load overview data");
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {[...Array(8)].map((_, i) => (
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

  if (!overview) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {overview.totalUsers}
          </p>
          <p className="text-sm text-green-500 mt-2">Active members</p>
        </div>

        {/* Work Programs Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Work Programs
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {overview.totalWorkPrograms}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {overview.activePrograms} ongoing
          </p>
        </div>

        {/* Events Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Upcoming Events
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {overview.upcomingEvents}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {overview.nextEvent
              ? `Next: ${overview.nextEvent.name}`
              : "No upcoming events"}
          </p>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Documents
          </h2>
          <p className="text-3xl font-bold text-yellow-600">
            {overview.totalDocuments}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {overview.pendingDocuments} pending review
          </p>
        </div>

        {/* Finance Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Budget</h2>
          <p className="text-3xl font-bold text-red-600">
            Rp {overview.totalBudget.toLocaleString()}
          </p>
          <p className="text-sm text-green-500 mt-2">Current total</p>
        </div>

        {/* Letters Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Processed Letters
          </h2>
          <p className="text-3xl font-bold text-indigo-600">
            {overview.processedLetters}
          </p>
          <p className="text-sm text-gray-500 mt-2">Total processed</p>
        </div>

        {/* Articles Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Published Articles
          </h2>
          <p className="text-3xl font-bold text-pink-600">
            {overview.publishedArticles}
          </p>
          <p className="text-sm text-green-500 mt-2">Published</p>
        </div>

        {/* Gallery Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Gallery Items
          </h2>
          <p className="text-3xl font-bold text-teal-600">
            {overview.galleryItems}
          </p>
          <p className="text-sm text-gray-500 mt-2">Total items</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {overview.recentActivities.length > 0 ? (
              overview.recentActivities.map((activity: ActivityLog) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {activity.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            System Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Active Period
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {overview.activePeriod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                External Links
              </span>
              <span className="text-sm text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Pending Approvals
              </span>
              <span className="text-sm text-gray-900">
                {overview.pendingApprovals}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                System Health
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                Optimal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
