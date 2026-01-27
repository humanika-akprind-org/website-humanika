"use client";

import { FiTag, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import type { FinanceCategory } from "@/types/finance-category";
import { FinanceType } from "@/types/enums";
import StatCard from "../../../ui/card/StatCard";

interface FinanceCategoryStatsProps {
  categories: FinanceCategory[];
}

export default function FinanceCategoryStats({
  categories,
}: FinanceCategoryStatsProps) {
  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: FiTag,
      color: "blue",
    },
    {
      title: "Income Categories",
      value: categories.filter(
        (category) => category.type === FinanceType.INCOME
      ).length,
      icon: FiTrendingUp,
      color: "emerald",
    },
    {
      title: "Expense Categories",
      value: categories.filter(
        (category) => category.type === FinanceType.EXPENSE
      ).length,
      icon: FiTrendingDown,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
