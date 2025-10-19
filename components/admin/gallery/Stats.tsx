"use client";

import {
  FiImage,
  FiVideo,
  FiFile,
} from "react-icons/fi";
import type { Gallery } from "@/types/gallery";

interface StatsProps {
  galleries: Gallery[];
}

export default function Stats({ galleries }: StatsProps) {
  // Calculate stats
  const totalGalleries = galleries.length;
  const totalImages = galleries.length; // Assuming all are images for now
  const totalVideos = 0; // No videos for now
  const totalDocuments = 0; // No documents for now

  const stats = [
    {
      title: "Total Galleries",
      value: totalGalleries.toString(),
      icon: FiImage,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Images",
      value: totalImages.toString(),
      icon: FiImage,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Videos",
      value: totalVideos.toString(),
      icon: FiVideo,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Documents",
      value: totalDocuments.toString(),
      icon: FiFile,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
