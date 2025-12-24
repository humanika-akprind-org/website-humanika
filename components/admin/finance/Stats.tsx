"use client";

import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import type { Finance } from "@/types/finance";
import { FinanceType } from "@/types/enums";
import StatCard from "../ui/card/StatCard";

interface FinanceStatsProps {
  finances: Finance[];
}

export default function FinanceStats({ finances }: FinanceStatsProps) {
  const totalTransactions = finances.length;
  const totalIncome = finances
    .filter((finance) => finance.type === FinanceType.INCOME)
    .reduce((sum, finance) => sum + finance.amount, 0);
  const totalExpense = finances
    .filter((finance) => finance.type === FinanceType.EXPENSE)
    .reduce((sum, finance) => sum + finance.amount, 0);
  const netAmount = totalIncome - totalExpense;

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
      value: totalTransactions,
      icon: FiDollarSign,
      color: "blue",
    },
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: FiTrendingUp,
      color: "green",
    },
    {
      title: "Total Expense",
      value: formatCurrency(totalExpense),
      icon: FiTrendingDown,
      color: "red",
    },
    {
      title: "Net Amount",
      value: formatCurrency(netAmount),
      icon: netAmount >= 0 ? FiTrendingUp : FiTrendingDown,
      color: netAmount >= 0 ? "green" : "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
