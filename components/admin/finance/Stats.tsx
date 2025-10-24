"use client";

import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import type { Finance } from "@/types/finance";
import { FinanceType } from "@/types/enums";

interface StatsProps {
  finances: Finance[];
}

export default function Stats({ finances }: StatsProps) {
  // Calculate stats
  const totalTransactions = finances.length;
  const totalIncome = finances
    .filter((finance) => finance.type === FinanceType.INCOME)
    .reduce((sum, finance) => sum + finance.amount, 0);
  const totalExpense = finances
    .filter((finance) => finance.type === FinanceType.EXPENSE)
    .reduce((sum, finance) => sum + finance.amount, 0);
  const netAmount = totalIncome - totalExpense;

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const stats = [
    {
      title: "Total Transactions",
      value: totalTransactions.toString(),
      icon: FiDollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
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
      title: "Net Amount",
      value: formatCurrency(netAmount),
      icon: netAmount >= 0 ? FiTrendingUp : FiTrendingDown,
      color: netAmount >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netAmount >= 0 ? "bg-green-100" : "bg-red-100",
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
