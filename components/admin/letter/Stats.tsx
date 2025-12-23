"use client";

import {
  FiFileText,
  FiCheckCircle,
  FiTrendingUp,
  FiArchive,
} from "react-icons/fi";
import type { Letter } from "types/letter";
import { Status } from "types/enums";
import StatCard from "../ui/card/StatCard";

interface StatsProps {
  letters: Letter[];
  typeFilter?: string;
}

export default function Stats({ letters, typeFilter }: StatsProps) {
  const filteredLetters = typeFilter
    ? letters.filter((letter) => letter.type.toLowerCase() === typeFilter)
    : letters;

  const stats = [
    {
      title: "Total Letters",
      value: filteredLetters.length,
      icon: FiFileText,
      color: "blue",
    },
    {
      title: "Published",
      value: filteredLetters.filter(
        (letter) => letter.status === Status.PUBLISH
      ).length,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Drafts",
      value: filteredLetters.filter((letter) => letter.status === Status.DRAFT)
        .length,
      icon: FiTrendingUp,
      color: "yellow",
    },
    {
      title: "Archived",
      value: filteredLetters.filter(
        (letter) => letter.status === Status.ARCHIVE
      ).length,
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
