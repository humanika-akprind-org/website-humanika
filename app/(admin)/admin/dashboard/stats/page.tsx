"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Icons } from "@/components/icons";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import { useFinances } from "@/hooks/finance/useFinances";
import { useLetters } from "@/hooks/letter/useLetters";
import { useArticles } from "@/hooks/article/useArticles";
import { useGalleries } from "@/hooks/gallery/useGalleries";
import { useUsers } from "@/hooks/user/useUsers";
import { useStructures } from "@/hooks/structure/useStructures";
import { useEvents } from "@/hooks/event/useEvents";

// Dashboard Component
export default function DashboardPage() {
  const { finances, isLoading: financesLoading } = useFinances();
  const { letters, isLoading: lettersLoading } = useLetters();
  const { articles, isLoading: articlesLoading } = useArticles();
  const { galleries, isLoading: galleriesLoading } = useGalleries();
  const { users, isLoading: usersLoading } = useUsers();
  const { structures, isLoading: structuresLoading } = useStructures();
  const { events, isLoading: eventsLoading } = useEvents();

  // Process finance data for area chart
  const financeData = React.useMemo(() => {
    if (financesLoading || !finances.length) return [];

    // Group by month and calculate income/expense
    const monthlyData: { [key: string]: { income: number; expense: number } } =
      {};

    finances.forEach((finance) => {
      const date = new Date(finance.date);
      const monthKey = date.toLocaleString("id-ID", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (finance.type === "INCOME") {
        monthlyData[monthKey].income += finance.amount;
      } else {
        monthlyData[monthKey].expense += finance.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month + " 1");
        const dateB = new Date(b.month + " 1");
        return dateA.getTime() - dateB.getTime();
      });
  }, [finances, financesLoading]);

  // Process letter data for pie chart
  const letterData = React.useMemo(() => {
    if (lettersLoading || !letters.length) return [];

    const incoming = letters.filter(
      (letter) => letter.type === "INCOMING"
    ).length;
    const outgoing = letters.filter(
      (letter) => letter.type === "OUTGOING"
    ).length;

    return [
      { name: "Surat Masuk", value: incoming, color: "#0088FE" },
      { name: "Surat Keluar", value: outgoing, color: "#FF8042" },
    ];
  }, [letters, lettersLoading]);

  // Process department data for radar chart
  const departmentData = React.useMemo(() => {
    if (structuresLoading || !structures.length) return [];

    // Count members per department
    const departmentCounts: { [key: string]: number } = {};
    users.forEach((user) => {
      if (user.department) {
        departmentCounts[user.department] =
          (departmentCounts[user.department] || 0) + 1;
      }
    });

    return structures.map((structure) => ({
      subject: structure.name,
      A: departmentCounts[structure.name] || 0,
      fullMark: 100,
    }));
  }, [structures, users, structuresLoading, usersLoading]);

  // Calculate totals
  const totalIncome = React.useMemo(
    () =>
      finances
        .filter((f) => f.type === "INCOME")
        .reduce((sum, f) => sum + f.amount, 0),
    [finances]
  );

  const totalExpense = React.useMemo(
    () =>
      finances
        .filter((f) => f.type === "EXPENSE")
        .reduce((sum, f) => sum + f.amount, 0),
    [finances]
  );

  const totalBalance = totalIncome - totalExpense;

  // Count metrics
  const totalPengurus = users.filter(
    (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
  ).length;
  const infokomMembers = users.filter((u) => u.department === "INFOKOM").length;
  const psdmMembers = users.filter((u) => u.department === "PSDM").length;
  const wirausahaMembers = users.filter(
    (u) => u.department === "WIRAUSAHA"
  ).length;
  const litbangMembers = users.filter((u) => u.department === "LITBANG").length;
  const totalArticles = articles.length;
  const totalEvents = events.length;
  const totalGallery = galleries.length;

  const isLoading =
    financesLoading ||
    lettersLoading ||
    articlesLoading ||
    galleriesLoading ||
    usersLoading ||
    structuresLoading ||
    eventsLoading;

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
          <Icons.barChart className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quick Stats</h1>
          <p className="text-gray-600 mt-1">Data real-time dari sistem</p>
        </div>
      </div>

      {/* Finance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon="dollarSign"
          color="green"
          value={`RP ${totalBalance.toLocaleString("id-ID")}`}
          title="Total Balance"
          statusIcon="trendingUp"
          statusColor="green-500"
          statusText="Net balance"
          valueSize="lg"
        />

        <MetricCard
          icon="trendingUp"
          color="green"
          value={`RP ${totalIncome.toLocaleString("id-ID")}`}
          title="Total Income"
          statusIcon="trendingUp"
          statusColor="green-500"
          statusText="Total income"
          valueSize="lg"
        />

        <MetricCard
          icon="dollarSign"
          color="red"
          value={`RP ${totalExpense.toLocaleString("id-ID")}`}
          title="Total Expense"
          statusIcon="close"
          statusColor="red-500"
          statusText="Total expense"
          valueSize="lg"
        />
      </div>

      {/* Finance Chart */}
      {financeData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <Icons.trendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Keuangan: Pendapatan vs Pengeluaran
            </h2>
          </div>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={financeData}
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F44336" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F44336" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) =>
                    `RP ${value.toLocaleString("id-ID")}`
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    `RP ${(value ?? 0).toLocaleString("id-ID")}`,
                    "Nilai",
                  ]}
                  labelFormatter={(label) => `Bulan: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#4CAF50"
                  fill="url(#colorIncome)"
                  name="Pendapatan"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stackId="1"
                  stroke="#F44336"
                  fill="url(#colorExpense)"
                  name="Pengeluaran"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Organization Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="users"
          color="green"
          value={totalPengurus}
          title="Total Pengurus"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Active period"
        />

        <MetricCard
          icon="users"
          color="blue"
          value={infokomMembers}
          title="INFOKOM"
          statusIcon="users"
          statusColor="blue-500"
          statusText="Total members"
        />

        <MetricCard
          icon="users"
          color="purple"
          value={psdmMembers}
          title="PSDM"
          statusIcon="users"
          statusColor="purple-500"
          statusText="Total members"
        />

        <MetricCard
          icon="newspaper"
          color="orange"
          value={totalArticles}
          title="Articles"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Published"
        />
      </div>

      {/* Content & Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="users"
          color="red"
          value={wirausahaMembers}
          title="WIRAUSAHA"
          statusIcon="users"
          statusColor="red-500"
          statusText="Total members"
        />

        <MetricCard
          icon="users"
          color="teal"
          value={litbangMembers}
          title="LITBANG"
          statusIcon="users"
          statusColor="teal-500"
          statusText="Total members"
        />

        <MetricCard
          icon="calendar"
          color="pink"
          value={totalEvents}
          title="Events"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Published"
        />

        <MetricCard
          icon="image"
          color="indigo"
          value={totalGallery}
          title="Gallery"
          statusIcon="image"
          statusColor="gray-500"
          statusText="Total items"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Letters Chart */}
        {letterData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Icons.mail className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Surat: Masuk vs Keluar
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={letterData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {letterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value ?? 0} surat`, "Jumlah"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Department Contribution Chart */}
        {departmentData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <Icons.users className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Kontribusi Departemen
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={departmentData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#6b7280" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Radar
                    name="Kontribusi"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Kontribusi"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
