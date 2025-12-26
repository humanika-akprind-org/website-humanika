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

// Dashboard Component
export default function DashboardPage() {
  // Data untuk grafik keuangan
  const financeData = [
    { month: "Jan", income: 4200, expense: 2400 },
    { month: "Feb", income: 5200, expense: 3200 },
    { month: "Mar", income: 6100, expense: 3800 },
    { month: "Apr", income: 4800, expense: 4200 },
    { month: "May", income: 7200, expense: 5100 },
    { month: "Jun", income: 8200, expense: 6200 },
    { month: "Jul", income: 9300, expense: 7100 },
    { month: "Aug", income: 10100, expense: 8200 },
    { month: "Sep", income: 9500, expense: 7800 },
    { month: "Oct", income: 11200, expense: 9100 },
    { month: "Nov", income: 12500, expense: 9800 },
    { month: "Dec", income: 13800, expense: 10500 },
  ];

  // Data untuk pie chart surat
  const letterData = [
    { name: "Surat Masuk", value: 65, color: "#0088FE" },
    { name: "Surat Keluar", value: 35, color: "#FF8042" },
  ];

  // Data untuk radar chart kontribusi departemen
  const departmentData = [
    { subject: "INFOKOM", A: 85, fullMark: 100 },
    { subject: "WIRAUSAHA", A: 70, fullMark: 100 },
    { subject: "LITBANG", A: 65, fullMark: 100 },
    { subject: "PSDM", A: 80, fullMark: 100 },
    { subject: "BPH", A: 90, fullMark: 100 },
    { subject: "DPO", A: 75, fullMark: 100 },
  ];

  // Hitung total income, expense, dan balance
  const totalIncome = financeData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = financeData.reduce((sum, item) => sum + item.expense, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
          <Icons.barChart className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quick Stats</h1>
          <p className="text-gray-600 mt-1">
            Data periode Januari - Desember 2023
          </p>
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
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                tickFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
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

      {/* Organization Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon="users"
          color="green"
          value={45}
          title="Total Pengurus"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Active period"
        />

        <MetricCard
          icon="users"
          color="blue"
          value={120}
          title="INFOKOM"
          statusIcon="users"
          statusColor="blue-500"
          statusText="Total members"
        />

        <MetricCard
          icon="users"
          color="purple"
          value={85}
          title="PSDM"
          statusIcon="users"
          statusColor="purple-500"
          statusText="Total members"
        />

        <MetricCard
          icon="newspaper"
          color="orange"
          value={156}
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
          value={78}
          title="WIRAUSAHA"
          statusIcon="users"
          statusColor="red-500"
          statusText="Total members"
        />

        <MetricCard
          icon="users"
          color="teal"
          value={92}
          title="LITBANG"
          statusIcon="users"
          statusColor="teal-500"
          statusText="Total members"
        />

        <MetricCard
          icon="calendar"
          color="pink"
          value={34}
          title="Events"
          statusIcon="checkCircle"
          statusColor="green-500"
          statusText="Published"
        />

        <MetricCard
          icon="image"
          color="indigo"
          value={67}
          title="Gallery"
          statusIcon="image"
          statusColor="gray-500"
          statusText="Total items"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Letters Chart */}
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

        {/* Department Contribution Chart */}
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
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280" }} />
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
      </div>
    </div>
  );
}
