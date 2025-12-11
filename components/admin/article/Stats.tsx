"use client";

import { FiFileText, FiEye, FiTrendingUp, FiArchive } from "react-icons/fi";
import type { Article } from "@/types/article";
import { Status } from "@/types/enums";
import StatCard from "../ui/card/StatCard";

interface StatsProps {
  articles: Article[];
}

export default function Stats({ articles }: StatsProps) {
  const stats = [
    {
      title: "Total Articles",
      value: articles.length,
      icon: FiFileText,
      color: "blue",
    },
    {
      title: "Published Articles",
      value: articles.filter((article) => article.isPublished).length,
      icon: FiEye,
      color: "green",
    },
    {
      title: "Draft Articles",
      value: articles.filter((article) => article.status === Status.DRAFT)
        .length,
      icon: FiTrendingUp,
      color: "yellow",
    },
    {
      title: "Archived Articles",
      value: articles.filter((article) => article.status === Status.ARCHIVE)
        .length,
      icon: FiArchive,
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
