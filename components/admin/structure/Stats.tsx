"use client";

import {
  FiFileText,
  FiTrendingUp,
  FiCheckCircle,
  FiEdit,
} from "react-icons/fi";
import type { OrganizationalStructure } from "@/types/structure";
import { Status } from "@/types/enums";

interface StatsProps {
  structures: OrganizationalStructure[];
}

export default function Stats({ structures }: StatsProps) {
  // Calculate stats
  const totalStructures = structures.length;
  const publishedStructures = structures.filter(
    (structure) => structure.status === Status.PUBLISH
  ).length;
  const pendingStructures = structures.filter(
    (structure) => structure.status === Status.PENDING
  ).length;
  const draftStructures = structures.filter(
    (structure) => structure.status === Status.DRAFT
  ).length;

  const stats = [
    {
      title: "Total Structures",
      value: totalStructures.toString(),
      icon: FiFileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published",
      value: publishedStructures.toString(),
      icon: FiCheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending",
      value: pendingStructures.toString(),
      icon: FiTrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Draft",
      value: draftStructures.toString(),
      icon: FiEdit,
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
