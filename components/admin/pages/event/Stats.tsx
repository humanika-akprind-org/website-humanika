"use client";

import { FiCalendar, FiCheckCircle, FiFileText, FiClock } from "react-icons/fi";
import type { Event } from "@/types/event";
import { Status } from "@/types/enums";
import StatCard from "../../ui/card/StatCard";

interface StatsProps {
  events: Event[];
}

export default function Stats({ events }: StatsProps) {
  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: FiCalendar,
      color: "blue",
    },
    {
      title: "Completed Events",
      value: events.filter((event) => event.status === Status.PUBLISH).length,
      icon: FiCheckCircle,
      color: "orange",
    },
    {
      title: "Draft Events",
      value: events.filter((event) => event.status === Status.DRAFT).length,
      icon: FiFileText,
      color: "green",
    },
    {
      title: "Pending Events",
      value: events.filter((event) => event.status === Status.PENDING).length,
      icon: FiClock,
      color: "yellow",
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
