import { FiUsers, FiUserCheck, FiUserX, FiMail } from "react-icons/fi";
import type { User } from "@/types/user";

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
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClass = `bg-${stat.color}-100 text-${stat.color}-500`;

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
              <div className={`p-2 ${colorClass} rounded-lg`}>
                <Icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
