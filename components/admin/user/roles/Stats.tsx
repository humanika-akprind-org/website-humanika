import { FiUsers, FiUserCheck, FiUserX, FiMail } from "react-icons/fi";
import type { User } from "@/types/user";
import StatCard from "../../ui/card/StatCard";

interface UserStatsProps {
  users: User[];
  selectedUsersCount?: number;
}

export default function UserStats({
  users,
  selectedUsersCount = 0,
}: UserStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
      color: "blue",
    },
    {
      title: "Selected Users",
      value: selectedUsersCount,
      icon: FiUserCheck,
      color: "green",
    },
    {
      title: "Unverified Users",
      value: users.filter((u) => !u.verifiedAccount).length,
      icon: FiMail,
      color: "yellow",
    },
    {
      title: "Inactive Users",
      value: users.filter((u) => !u.isActive).length,
      icon: FiUserX,
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
