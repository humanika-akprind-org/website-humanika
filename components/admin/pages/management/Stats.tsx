"use client";

import React from "react";
import { FiUsers, FiCode, FiZap, FiShield } from "react-icons/fi";
import StatCard from "../../ui/card/StatCard";
import type { Management } from "@/types/management";

interface ManagementStatsProps {
  managements: Management[];
}

const ManagementStats: React.FC<ManagementStatsProps> = ({ managements }) => {
  const departmentStats = {
    INFOKOM: managements.filter((m) => m.department === "INFOKOM").length,
    PSDM: managements.filter((m) => m.department === "PSDM").length,
    LITBANG: managements.filter((m) => m.department === "LITBANG").length,
    KWU: managements.filter((m) => m.department === "KWU").length,
  };
  const stats = [
    {
      title: "INFOKOM",
      value: departmentStats.INFOKOM,
      icon: FiCode,
      color: "blue",
    },
    {
      title: "PSDM",
      value: departmentStats.PSDM,
      icon: FiUsers,
      color: "green",
    },
    {
      title: "LITBANG",
      value: departmentStats.LITBANG,
      icon: FiZap,
      color: "yellow",
    },
    {
      title: "KEWIRAUSAHAAN",
      value: departmentStats.KWU,
      icon: FiShield,
      color: "purple",
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
};

export default ManagementStats;
