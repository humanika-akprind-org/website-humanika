import React from "react";

export interface StatItem {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon?: React.ReactNode;
  color?: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
  columns?: number;
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  columns = 4,
  className = "",
}) => {
  const gridClass = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`;

  return (
    <div className={className}>
      <div className={gridClass}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <div
                  className={`flex items-center mt-2 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-sm font-medium">{stat.change}</span>
                  <svg
                    className={`w-4 h-4 ml-1 ${
                      stat.trend === "up" ? "rotate-0" : "rotate-180"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {stat.icon && (
                <div
                  className={`p-3 rounded-lg ${stat.color || "bg-blue-100"}`}
                >
                  {stat.icon}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;
