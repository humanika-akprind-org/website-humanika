"use client";

import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";
import type { DepartmentTask } from "@/types/task";
import { Status } from "@/types/enums";

interface StatsProps {
  tasks: DepartmentTask[];
}

export default function Stats({ tasks }: StatsProps) {
  // Calculate stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (task) => task.status === Status.PENDING
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === Status.PUBLISH
  ).length;
  const draftTasks = tasks.filter(
    (task) => task.status === Status.DRAFT
  ).length;
  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      icon: FiCheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks.toString(),
      icon: FiClock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completed Tasks",
      value: completedTasks.toString(),
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Draft Tasks",
      value: draftTasks.toString(),
      icon: FiFileText,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
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
