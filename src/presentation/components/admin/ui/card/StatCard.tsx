import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const Icon = icon;
  const colorClass = `bg-${color}-100 text-${color}-500`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 ${colorClass} rounded-lg`}>
          <Icon />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}
