"use client";

import { type Statistic } from "@/types/statistic";

interface StatisticStatsProps {
  statistics: Statistic[];
}

export default function StatisticStats({ statistics }: StatisticStatsProps) {
  const totalActiveMembers = statistics.reduce(
    (sum, stat) => sum + stat.activeMembers,
    0
  );
  const totalAnnualEvents = statistics.reduce(
    (sum, stat) => sum + stat.annualEvents,
    0
  );
  const totalCollaborativeProjects = statistics.reduce(
    (sum, stat) => sum + stat.collaborativeProjects,
    0
  );
  const totalInnovationProjects = statistics.reduce(
    (sum, stat) => sum + stat.innovationProjects,
    0
  );
  const totalAwards = statistics.reduce((sum, stat) => sum + stat.awards, 0);
  const averageMemberSatisfaction =
    statistics.length > 0
      ? Math.round(
          statistics.reduce((sum, stat) => sum + stat.memberSatisfaction, 0) /
            statistics.length
        )
      : 0;
  const totalLearningMaterials = statistics.reduce(
    (sum, stat) => sum + stat.learningMaterials,
    0
  );

  const stats = [
    {
      title: "Total Active Members",
      value: totalActiveMembers.toLocaleString(),
      color: "text-blue-600",
    },
    {
      title: "Total Annual Events",
      value: totalAnnualEvents.toLocaleString(),
      color: "text-green-600",
    },
    {
      title: "Collaborative Projects",
      value: totalCollaborativeProjects.toLocaleString(),
      color: "text-purple-600",
    },
    {
      title: "Innovation Projects",
      value: totalInnovationProjects.toLocaleString(),
      color: "text-orange-600",
    },
    {
      title: "Total Awards",
      value: totalAwards.toLocaleString(),
      color: "text-red-600",
    },
    {
      title: "Avg Member Satisfaction",
      value: `${averageMemberSatisfaction}%`,
      color: "text-indigo-600",
    },
    {
      title: "Learning Materials",
      value: totalLearningMaterials.toLocaleString(),
      color: "text-teal-600",
    },
    {
      title: "Total Statistics",
      value: statistics.length.toString(),
      color: "text-gray-600",
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
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
