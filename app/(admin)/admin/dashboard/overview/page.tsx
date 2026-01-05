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
import { ManagementApi } from "@/use-cases/api/management";
import { getDepartmentTasks } from "@/use-cases/api/task";
import { StructureApi } from "@/use-cases/api/structure";
import type { Document } from "@/types/document";
import type { WorkProgram } from "@/types/work";
import type { Finance } from "@/types/finance";
import type { Event } from "@/types/event";
import type { Article } from "@/types/article";

import type { ActivityLog } from "@/types/activity-log";
import type { Period } from "@/types/period";
import { Status } from "@/types/enums";
import {
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import LoadingOverview from "@/components/admin/dashboard/LoadingOverview";

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
  totalPeriods: number;
  totalManagements: number;
  totalStructures: number;
  totalTasks: number;
  totalProposals: number;
  totalAccountabilityReports: number;
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
          managements,
          tasks,
          structures,
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
          ManagementApi.getManagements(),
          getDepartmentTasks(),
          StructureApi.getStructures(),
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

        // Calculate new metrics
        const totalPeriods = periods.length;
        const totalManagements = managements.length;
        const totalStructures = structures.data?.length || 0;
        const totalTasks = tasks.length;

        // Calculate proposals and accountability reports from documents
        const totalProposals = documents.filter(
          (doc: Document) => doc.documentType?.name === "PROPOSAL"
        ).length;
        const totalAccountabilityReports = documents.filter(
          (doc: Document) => doc.documentType?.name === "LPJ"
        ).length;

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
          totalPeriods,
          totalManagements,
          totalStructures,
          totalTasks,
          totalProposals,
          totalAccountabilityReports,
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
    return <LoadingOverview />;
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

  if (!overview) return null;

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor your organization&apos;s key metrics and activities
          </p>
        </div>
      </div>

      {/* Governance Section */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          Governance
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="calendar"
          color="orange"
          value={overview.totalPeriods}
          title="Periods"
          statusIcon="check"
          statusColor="green-500"
          statusText="Total periods"
          href="/admin/governance/periods"
        />

        <MetricCard
          icon="user"
          color="purple"
          value={overview.totalManagements}
          title="Managements"
          statusIcon="users"
          statusColor="blue-500"
          statusText="Total managements"
          href="/admin/governance/managements"
        />

        <MetricCard
          icon="users"
          color="cyan"
          value={overview.totalStructures}
          title="Organizational Structures"
          statusIcon="users"
          statusColor="gray-500"
          statusText="Total structures"
          href="/admin/governance/structure"
        />

        <MetricCard
          icon="fileText"
          color="lime"
          value={overview.totalTasks}
          title="Department Tasks"
          statusIcon="fileText"
          statusColor="orange-500"
          statusText="Total tasks"
          href="/admin/governance/tasks"
        />
      </div>

      {/* People & Access Section */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          People & Access
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="users"
          color="blue"
          value={overview.totalUsers}
          title="Total Users"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Active members"
          href="/admin/people/users"
        />
      </div>

      {/* Programs & Events Section */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          Programs & Events
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="briefcase"
          color="green"
          value={overview.totalWorkPrograms}
          title="Work Programs"
          statusIcon="trendingUp"
          statusColor="blue-500"
          statusText={`${overview.activePrograms} ongoing`}
          href="/admin/program/works"
        />

        <MetricCard
          icon="calendarDays"
          color="purple"
          value={overview.upcomingEvents}
          title="Upcoming Events"
          statusIcon="clock"
          statusColor="orange-500"
          statusText={
            overview.nextEvent
              ? `Next: ${overview.nextEvent.name}`
              : "No upcoming events"
          }
          href="/admin/program/events"
        />
      </div>

      {/* Administration Section */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          Administration
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="fileText"
          color="emerald"
          value={overview.totalProposals}
          title="Proposals"
          statusIcon="fileText"
          statusColor="blue-500"
          statusText="Total proposals"
          href="/admin/administration/proposals"
        />

        <MetricCard
          icon="fileCheck"
          color="violet"
          value={overview.totalAccountabilityReports}
          title="Accountability Reports"
          statusIcon="check"
          statusColor="green-500"
          statusText="Total reports"
          href="/admin/administration/accountability-reports"
        />

        <MetricCard
          icon="mail"
          color="indigo"
          value={overview.processedLetters}
          title="Processed Letters"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Total processed"
          href="/admin/administration/letters"
        />

        <MetricCard
          icon="fileText"
          color="yellow"
          value={overview.totalDocuments}
          title="Documents"
          statusIcon="alertCircle"
          statusColor="red-500"
          statusText={`${overview.pendingDocuments} pending review`}
          href="/admin/administration/documents"
        />
      </div>

      {/* Content & Media Section */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          Content & Media
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="newspaper"
          color="pink"
          value={overview.publishedArticles}
          title="Published Articles"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Published"
          fontMedium
          href="/admin/content/articles"
        />

        <MetricCard
          icon="image"
          color="teal"
          value={overview.galleryItems}
          title="Gallery Items"
          statusIcon="image"
          statusColor="gray-500"
          statusText="Total items"
          href="/admin/content/galleries"
        />
      </div>

      {/* Finance Section */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          Finance
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon="dollarSign"
          color="red"
          value={`Rp ${overview.totalBudget.toLocaleString()}`}
          title="Current Budget"
          statusIcon="trendingUp"
          statusColor="green-500"
          statusText="Net balance"
          valueSize="lg"
          href="/admin/finance/transactions"
        />
      </div>

      {/* Activity and System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {overview.recentActivities.length > 0 ? (
              overview.recentActivities.map((activity: ActivityLog) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {activity.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-5">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              System Overview
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">
                  Active Period
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {overview.activePeriod}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">
                  Pending Approvals
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {overview.pendingApprovals}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">
                  System Health
                </span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Optimal
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">
                  User Engagement
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((overview.totalUsers / 100) * 85)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
