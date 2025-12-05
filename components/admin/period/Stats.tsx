import type { Period } from "@/types/period";
import { FiUsers, FiClock, FiCheckCircle, FiCalendar } from "react-icons/fi";
import StatCard from "../ui/card/StatCard";

interface PeriodStatsProps {
  periods: Period[];
}

export default function PeriodStats({ periods }: PeriodStatsProps) {
  const stats = [
    {
      title: "Total Period",
      value: periods.length,
      icon: FiUsers,
      color: "blue",
    },
    {
      title: "Active",
      value: periods.filter((p) => p.isActive).length,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Inactive",
      value: periods.filter((p) => !p.isActive).length,
      icon: FiClock,
      color: "yellow",
    },
    {
      title: "Total Years",
      value: periods.reduce(
        (total, period) => total + (period.endYear - period.startYear + 1),
        0
      ),
      icon: FiCalendar,
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
}
