"use client";

import {
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";
import type { Event } from "@/types/event";
import { Status } from "@/types/enums";
import StatCard from "../ui/card/StatCard";

interface StatsProps {
  events: Event[];
}

export default function Stats({ events }: StatsProps) {
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
      title: "Total Events",
      value: events.length,
      icon: FiCalendar,
      color: "blue",
    },
    {
      title: "Total Budget",
      value: formatCurrency(
        events.reduce((sum, event) => sum + event.funds, 0)
      ),
      icon: FiDollarSign,
      color: "green",
    },
    {
      title: "Funds Used",
      value: formatCurrency(
        events.reduce((sum, event) => sum + event.usedFunds, 0)
      ),
      icon: FiTrendingUp,
      color: "purple",
    },
    {
      title: "Completed Events",
      value: events.filter((event) => event.status === Status.PUBLISH).length,
      icon: FiCheckCircle,
      color: "orange",
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
