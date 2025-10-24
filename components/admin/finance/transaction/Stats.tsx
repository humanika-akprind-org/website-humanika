"use client";

import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import type { Finance } from "@/types/finance";

interface StatsProps {
  finances: Finance[];
}

export default function Stats({ finances }: StatsProps) {
  // Calculate totals
  const totalIncome = finances
    .filter((f) => f.type === "INCOME" && f.status === "PUBLISH")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpense = finances
    .filter((f) => f.type === "EXPENSE" && f.status === "PUBLISH")
    .reduce((sum, f) => sum + f.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalTransactions = finances.length;
  const pendingTransactions = finances.filter(
    (f) => f.status === "PENDING"
  ).length;
  const approvedTransactions = finances.filter(
    (f) => f.status === "PUBLISH"
  ).length;
  const rejectedTransactions = finances.filter(
    (f) => f.status === "ARCHIVE"
  ).length;

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Expense",
      value: formatCurrency(totalExpense),
      icon: FiTrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Net Balance",
      value: formatCurrency(netBalance),
      icon: FiDollarSign,
      color: netBalance >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netBalance >= 0 ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toString(),
      icon: FiDollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: pendingTransactions.toString(),
      icon: FiClock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Approved",
      value: approvedTransactions.toString(),
      icon: FiCheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Rejected",
      value: rejectedTransactions.toString(),
      icon: FiXCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
