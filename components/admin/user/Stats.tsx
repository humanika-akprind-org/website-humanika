import { FiUsers, FiUserCheck, FiUserX, FiMail } from "react-icons/fi";
import type { User } from "@/types/user";
import StatCard from "../ui/card/StatCard";

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
      color: "blue",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.isActive).length,
      icon: FiUserCheck,
      color: "green",
    },
    {
      title: "Inactive Users",
      value: users.filter((u) => !u.isActive).length,
      icon: FiUserX,
      color: "yellow",
    },
    {
      title: "Verified Emails",
      value: users.filter((u) => u.verifiedAccount).length,
      icon: FiMail,
      color: "green",
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
