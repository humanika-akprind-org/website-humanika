"use client";

import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";
import type { DepartmentTask } from "@/types/task";
import { Status } from "@/types/enums";
import StatCard from "../../ui/card/StatCard";

interface TaskStatsProps {
  tasks: DepartmentTask[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: FiCheckCircle,
      color: "blue",
    },
    {
      title: "Pending Tasks",
      value: tasks.filter((task) => task.status === Status.PENDING).length,
      icon: FiClock,
      color: "yellow",
    },
    {
      title: "Completed Tasks",
      value: tasks.filter((task) => task.status === Status.PUBLISH).length,
      icon: FiTrendingUp,
      color: "green",
    },
    {
      title: "Draft Tasks",
      value: tasks.filter((task) => task.status === Status.DRAFT).length,
      icon: FiFileText,
      color: "gray",
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
