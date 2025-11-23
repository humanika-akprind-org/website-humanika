"use client";

import {
  FiFileText,
  FiTrendingUp,
  FiCheckCircle,
  FiArchive,
} from "react-icons/fi";
import type { Letter } from "types/letter";
import { Status } from "types/enums";

interface StatsProps {
  letters: Letter[];
}

export default function Stats({ letters = [] }: StatsProps) {
  // Calculate stats
  const totalLetters = letters.length;
  const publishedLetters = letters.filter(
    (letter) => letter.status === Status.PUBLISH
  ).length;
  const draftLetters = letters.filter(
    (letter) => letter.status === Status.DRAFT
  ).length;
  const archivedLetters = letters.filter(
    (letter) => letter.status === Status.ARCHIVE
  ).length;

  const stats = [
    {
      title: "Total Letters",
      value: totalLetters.toString(),
      icon: FiFileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published",
      value: publishedLetters.toString(),
      icon: FiCheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Drafts",
      value: draftLetters.toString(),
      icon: FiTrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Archived",
      value: archivedLetters.toString(),
      icon: FiArchive,
      color: "text-red-600",
      bgColor: "bg-red-100",
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
