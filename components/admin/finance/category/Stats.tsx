"use client";

import {
  FiTag,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import type { FinanceCategory } from "@/types/finance-category";
import { FinanceType } from "@/types/enums";

interface StatsProps {
  categories: FinanceCategory[];
}

export default function Stats({ categories }: StatsProps) {
  // Calculate stats
  const totalCategories = categories.length;
  const incomeCategories = categories.filter(
    (cat) => cat.type === FinanceType.INCOME
  ).length;
  const expenseCategories = categories.filter(
    (cat) => cat.type === FinanceType.EXPENSE
  ).length;

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories.toString(),
      icon: FiTag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Categories",
      icon: FiCheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Income Categories",
      value: incomeCategories.toString(),
      icon: FiTrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Expense Categories",
      value: expenseCategories.toString(),
      icon: FiTrendingDown,
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
