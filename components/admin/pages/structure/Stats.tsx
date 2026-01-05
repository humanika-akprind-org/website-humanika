"use client";

import React from "react";
import {
  FiFileText,
  FiTrendingUp,
  FiCheckCircle,
  FiEdit,
} from "react-icons/fi";
import StatCard from "../../ui/card/StatCard";
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
      value: totalStructures,
      icon: FiFileText,
      color: "blue",
    },
    {
      title: "Published",
      value: publishedStructures,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Pending",
      value: pendingStructures,
      icon: FiTrendingUp,
      color: "orange",
    },
    {
      title: "Draft",
      value: draftStructures,
      icon: FiEdit,
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
