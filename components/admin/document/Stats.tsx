"use client";

import {
  FiFileText,
  FiCheckCircle,
  FiTrendingUp,
  FiArchive,
} from "react-icons/fi";
import type { Document } from "@/types/document";
import { Status } from "@/types/enums";
import StatCard from "../ui/card/StatCard";

interface StatsProps {
  documents: Document[];
}

export default function Stats({ documents }: StatsProps) {
  const stats = [
    {
      title: "Total Documents",
      value: documents.length,
      icon: FiFileText,
      color: "blue",
    },
    {
      title: "Published",
      value: documents.filter((doc) => doc.status === Status.PUBLISH).length,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Drafts",
      value: documents.filter((doc) => doc.status === Status.DRAFT).length,
      icon: FiTrendingUp,
      color: "yellow",
    },
    {
      title: "Archived",
      value: documents.filter((doc) => doc.status === Status.ARCHIVE).length,
      icon: FiArchive,
      color: "red",
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
