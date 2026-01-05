"use client";

import {
  FiTarget,
  FiCreditCard,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import type { WorkProgram } from "@/types/work";
import { formatCurrency } from "@/lib/utils";
import StatCard from "../../ui/card/StatCard";

interface WorkStatsProps {
  workPrograms: WorkProgram[];
}

export default function WorkStats({ workPrograms }: WorkStatsProps) {
  const stats = [
    {
      title: "Total Programs",
      value: workPrograms.length,
      icon: FiTarget,
      color: "blue",
    },
    {
      title: "Total Budget",
      value: formatCurrency(
        workPrograms.reduce((sum, program) => sum + program.funds, 0)
      ),
      icon: FiTrendingUp,
      color: "green",
    },
    {
      title: "Used Funds",
      value: formatCurrency(
        workPrograms.reduce((sum, program) => sum + program.usedFunds, 0)
      ),
      icon: FiTrendingDown,
      color: "yellow",
    },
    {
      title: "Remaining Funds",
      value: formatCurrency(
        workPrograms.reduce((sum, program) => sum + program.remainingFunds, 0)
      ),
      icon: FiCreditCard,
      color: "purple",
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
