"use client";

import {
  FiFileText,
  FiEye,
  FiTrendingUp,
  FiArchive,
} from "react-icons/fi";
import type { Article } from "@/types/article";
import { Status } from "@/types/enums";

interface StatsProps {
  articles: Article[];
}

export default function Stats({ articles }: StatsProps) {
  // Calculate stats
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(
    (article) => article.isPublished
  ).length;
  const draftArticles = articles.filter(
    (article) => article.status === Status.DRAFT
  ).length;
  const archivedArticles = articles.filter(
    (article) => article.status === Status.ARCHIVE
  ).length;

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles.toString(),
      icon: FiFileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published Articles",
      value: publishedArticles.toString(),
      icon: FiEye,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Draft Articles",
      value: draftArticles.toString(),
      icon: FiTrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Archived Articles",
      value: archivedArticles.toString(),
      icon: FiArchive,
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
