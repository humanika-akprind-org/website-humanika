// app/dashboard/stats/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  Mail,
  Image,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import type { Document } from "@/types/document";
import type { WorkProgram } from "@/types/work";
import type { Finance } from "@/types/finance";
import { Status } from "@/types/enums";

// Components
import ChartCard from "@/components/admin/dashboard/ChartCard";
import TimeFilter from "@/components/admin/dashboard/TimeFilter";
import LoadingSpinner from "@/components/admin/dashboard/LoadingSpinner";

interface StatsData {
  // User Stats
  totalUsers: number;
  activeUsers: number;
  userActivity: number;
  newUsers: number;

  // Administration Stats
  totalProposals: number;
  totalAccountabilityReports: number;
  activePrograms: number;
  completedPrograms: number;

  // Letter Stats
  totalLetters: number;
  incomingLetters: number;
  outgoingLetters: number;
  pendingLetters: number;

  // Public Content Stats
  totalArticles: number;
  totalEvents: number;
  totalGalleries: number;
  publishedArticles: number;

  // Finance Stats
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  budgetUtilization: number;
  totalBudget: number;
  pendingPayments: number;

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

  // Additional Metrics
  departmentStats: Array<{
    name: string;
    documents: number;
    activities: number;
    completion: number;
  }>;
  recentActivities: Array<{
    id: string;
    user: string;
    action: string;
    time: string;
    status: "success" | "warning" | "error";
  }>;
  topDocuments: Array<{
    title: string;
    type: string;
    views: number;
    status: string;
  }>;
}

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<string>("month");

  const fetchStats = useCallback(async () => {
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

      const users = usersResponse.data?.users || [];

      // Calculate document types distribution
      const documentTypes: { [key: string]: number } = {};
      documents.forEach((doc: Document) => {
        const type = doc.type || "Others";
        documentTypes[type] = (documentTypes[type] || 0) + 1;
      });

      // Calculate administration stats
      const totalProposals = documents.filter((doc: Document) =>
        doc.type?.toLowerCase().includes("proposal")
      ).length;
      const totalAccountabilityReports = documents.filter((doc: Document) =>
        doc.type?.toLowerCase().includes("accountability")
      ).length;

      // Calculate letter stats
      const incomingLetters = letters.filter(
        (letter: any) => letter.type === "INCOMING"
      ).length;
      const outgoingLetters = letters.filter(
        (letter: any) => letter.type === "OUTGOING"
      ).length;
      const pendingLetters = letters.filter(
        (letter: any) => letter.status === "PENDING"
      ).length;

      // Calculate finance stats
      const totalIncome = finances
        .filter((f: Finance) => f.type === "INCOME")
        .reduce((sum: number, f: Finance) => sum + (f.amount || 0), 0);
      const totalExpense = finances
        .filter((f: Finance) => f.type === "EXPENSE")
        .reduce((sum: number, f: Finance) => sum + (f.amount || 0), 0);
      const netIncome = totalIncome - totalExpense;
      const pendingPayments = finances.filter(
        (f: Finance) => f.status === "PENDING"
      ).length;

      // Calculate program stats
      const activePrograms = workPrograms.filter(
        (wp: WorkProgram) => wp.status === Status.PUBLISH
      ).length;
      const completedPrograms = workPrograms.filter(
        (wp: WorkProgram) => wp.status === Status.ARCHIVE
      ).length;

      // Calculate content stats
      const publishedArticles = articles.filter(
        (article: any) => article.status === Status.PUBLISH
      ).length;

      // Calculate user stats
      const userActivity = 84.2;
      const activeUsers = Math.round(users.length * (userActivity / 100));
      const newUsers = Math.round(users.length * 0.1); // 10% new users this month

      // Calculate budget utilization
      const budgetUtilization =
        totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;
      const totalBudget = totalIncome + totalExpense;

      // Mock calculations
      const taskCompletion = 76.5;
      const documentProcessing = 2.4;
      const systemUptime = 99.8;
      const monthlyActivities = [
        40, 55, 65, 50, 70, 85, 75, 80, 90, 95, 85, 100,
      ];

      // Department stats (mock data)
      const departmentStats = [
        { name: "HR", documents: 45, activities: 120, completion: 85 },
        { name: "Finance", documents: 78, activities: 95, completion: 92 },
        { name: "Operations", documents: 120, activities: 150, completion: 78 },
        { name: "IT", documents: 65, activities: 110, completion: 95 },
        { name: "Marketing", documents: 89, activities: 130, completion: 88 },
      ];

      // Recent activities (mock data)
      const recentActivities = [
        {
          id: "1",
          user: "John Doe",
          action: "Uploaded new document",
          time: "10:30 AM",
          status: "success" as const,
        },
        {
          id: "2",
          user: "Jane Smith",
          action: "Approved proposal",
          time: "11:15 AM",
          status: "success" as const,
        },
        {
          id: "3",
          user: "Robert Johnson",
          action: "System maintenance",
          time: "2:45 PM",
          status: "warning" as const,
        },
        {
          id: "4",
          user: "System",
          action: "Backup completed",
          time: "3:20 PM",
          status: "success" as const,
        },
      ];

      // Top documents (mock data)
      const topDocuments = [
        {
          title: "Annual Report 2024",
          type: "Report",
          views: 1245,
          status: "Published",
        },
        {
          title: "Q3 Financial Analysis",
          type: "Analysis",
          views: 892,
          status: "Published",
        },
        {
          title: "Employee Handbook",
          type: "Handbook",
          views: 756,
          status: "Draft",
        },
        {
          title: "Project Proposal - AI Integration",
          type: "Proposal",
          views: 543,
          status: "Review",
        },
      ];

      setStats({
        // User Stats
        totalUsers: users.length,
        activeUsers,
        userActivity,
        newUsers,

        // Administration Stats
        totalProposals,
        totalAccountabilityReports,
        activePrograms,
        completedPrograms,

        // Letter Stats
        totalLetters: letters.length,
        incomingLetters,
        outgoingLetters,
        pendingLetters,

        // Public Content Stats
        totalArticles: articles.length,
        totalEvents: events.length,
        totalGalleries: galleries.length,
        publishedArticles,

        // Finance Stats
        totalIncome,
        totalExpense,
        netIncome,
        budgetUtilization,
        totalBudget,
        pendingPayments,

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

        // Additional Metrics
        departmentStats,
        recentActivities,
        topDocuments,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  const handleExport = (format: "pdf" | "excel" | "json") => {
    // Export implementation
    console.log(`Exporting as ${format}`);
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Error Loading Statistics
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Data preparation for charts
  const documentTypeData = Object.entries(stats.documentTypes)
    .map(([name, value]) => ({
      name: name.replace("_", " "),
      value,
      percentage: ((value / stats.totalDocuments) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const monthlyData = stats.monthlyActivities.map((value, index) => ({
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
  }));

  const financialData = [
    { name: "Income", value: stats.totalIncome, color: "#10b981" },
    { name: "Expense", value: stats.totalExpense, color: "#ef4444" },
    { name: "Net", value: stats.netIncome, color: "#3b82f6" },
  ];

  const performanceData = [
    { month: "Jan", uptime: 99.8, activity: 84.2, completion: 76.5 },
    { month: "Feb", uptime: 99.9, activity: 85.1, completion: 78.2 },
    { month: "Mar", uptime: 99.7, activity: 83.8, completion: 75.9 },
    { month: "Apr", uptime: 99.8, activity: 86.3, completion: 79.1 },
    { month: "May", uptime: 99.9, activity: 87.2, completion: 80.5 },
    { month: "Jun", uptime: 99.8, activity: 85.9, completion: 77.8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              System Statistics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of system performance and metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <TimeFilter value={timeRange} onChange={setTimeRange} />
            <button
              onClick={handleRefresh}
              className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2 text-xs text-blue-600">
              {stats.userActivity}% active this week
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDocuments}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2 text-xs text-green-600">
              {stats.totalProposals} proposals pending
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {stats.totalIncome.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2 text-xs text-purple-600">
              {stats.budgetUtilization.toFixed(1)}% budget used
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.systemUptime}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-amber-400" />
            </div>
            <div className="mt-2 text-xs text-amber-600">
              System performance excellent
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Document Distribution */}
          <ChartCard
            title="Document Distribution"
            icon={<PieChartIcon className="w-5 h-5" />}
            action={
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                View details <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            }
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${percent ? (percent * 100).toFixed(1) : "0"}%)`
                    }
                  >
                    {documentTypeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Financial Overview */}
          <ChartCard
            title="Financial Overview"
            icon={<DollarSign className="w-5 h-5" />}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `Rp${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [
                      `Rp ${Number(value).toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Income</p>
                <p className="font-semibold text-gray-900">
                  Rp {stats.totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Expense</p>
                <p className="font-semibold text-gray-900">
                  Rp {stats.totalExpense.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Net</p>
                <p className="font-semibold text-gray-900">
                  Rp {stats.netIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </ChartCard>

          {/* Department Performance */}
          <ChartCard title="Department Performance">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={stats.departmentStats}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Completion Rate"
                    dataKey="completion"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* System Performance Trends */}
          <ChartCard
            title="System Performance Trends"
            icon={<TrendingUp className="w-5 h-5" />}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="activity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Monthly Activities */}
          <ChartCard
            title="Monthly Activities"
            icon={<Calendar className="w-5 h-5" />}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="activities"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Service Usage */}
          <ChartCard title="Service Usage">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDocuments}
                </p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Mail className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalLetters}
                </p>
                <p className="text-sm text-gray-600">Letters</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEvents}
                </p>
                <p className="text-sm text-gray-600">Events</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalArticles}
                </p>
                <p className="text-sm text-gray-600">Articles</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Image className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalGalleries}
                </p>
                <p className="text-sm text-gray-600">Galleries</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activePrograms}
                </p>
                <p className="text-sm text-gray-600">Active Programs</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Bottom Section - Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <ChartCard
          title="Recent Activities"
          icon={<Activity className="w-5 h-5" />}
          action={
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </button>
          }
        >
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top Documents */}
        <ChartCard
          title="Top Documents"
          icon={<FileText className="w-5 h-5" />}
          action={
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </button>
          }
        >
          <div className="space-y-4">
            {stats.topDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">{doc.type}</span>
                      <span className="text-gray-400">•</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          doc.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : doc.status === "Draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{doc.views}</p>
                  <p className="text-sm text-gray-600">views</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Task Completion</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.taskCompletion}%
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${stats.taskCompletion}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Processing Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.documentProcessing} days
          </p>
          <p className="text-xs text-gray-500 mt-1">Average</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Actions</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.pendingLetters + stats.pendingPayments}
          </p>
          <p className="text-xs text-gray-500 mt-1">Require attention</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Content Published</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.publishedArticles}
          </p>
          <p className="text-xs text-gray-500 mt-1">of {stats.totalArticles}</p>
        </div>
      </div>
    </div>
  );
}
