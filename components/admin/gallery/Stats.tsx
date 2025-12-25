"use client";

import { FiImage, FiFolder, FiInbox } from "react-icons/fi";
import type { Gallery } from "@/types/gallery";
import StatCard from "../ui/card/StatCard";

interface StatsProps {
  galleries: Gallery[];
}

export default function Stats({ galleries }: StatsProps) {
  // Calculate stats
  const totalGalleries = galleries.length;
  const totalImages = galleries.length; // Assuming all are images for now
  const totalGalleriesWithCategory = galleries.filter(
    (g) => g.categoryId
  ).length;
  const totalGalleriesWithoutCategory = galleries.filter(
    (g) => !g.categoryId
  ).length;

  const stats = [
    {
      title: "Total Galleries",
      value: totalGalleries,
      icon: FiImage,
      color: "blue",
    },
    {
      title: "Images",
      value: totalImages,
      icon: FiImage,
      color: "green",
    },
    {
      title: "With Category",
      value: totalGalleriesWithCategory,
      icon: FiFolder,
      color: "purple",
    },
    {
      title: "Without Category",
      value: totalGalleriesWithoutCategory,
      icon: FiInbox,
      color: "orange",
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
