"use client";

import { FiCalendar, FiTrendingUp, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import type { Event } from "@/types/event";
import { Status } from "@/types/enums";

interface StatsProps {
  events: Event[];
}

export default function Stats({ events }: StatsProps) {
  // Calculate stats
  const totalEvents = events.length;
  const totalBudget = events.reduce((sum, event) => sum + event.funds, 0);
  const totalUsedFunds = events.reduce((sum, event) => sum + event.usedFunds, 0);
  const completedEvents = events.filter(event => event.status === Status.COMPLETED).length;
  // const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;

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
      value: totalEvents.toString(),
      icon: FiCalendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Budget",
      value: formatCurrency(totalBudget),
      icon: FiDollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Funds Used",
      value: formatCurrency(totalUsedFunds),
      icon: FiTrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Completed Events",
      value: completedEvents.toString(),
      icon: FiCheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
