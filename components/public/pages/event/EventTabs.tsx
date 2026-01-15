import { motion } from "framer-motion";
import { Calendar, Trophy, BarChart3, Clock } from "lucide-react";
import type { EventTab, EventStats } from "@/hooks/event/useEventPage";

interface EventTabsProps {
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
  stats: EventStats;
}

export default function EventTabs({
  activeTab,
  onTabChange,
  stats,
}: EventTabsProps) {
  const tabs = [
    {
      id: "upcoming" as const,
      label: "Mendatang",
      icon: <Calendar className="w-4 h-4" />,
      count: stats.upcoming,
    },
    {
      id: "ongoing" as const,
      label: "Sedang Berlangsung",
      icon: <Clock className="w-4 h-4" />,
      count: stats.ongoing,
    },
    {
      id: "past" as const,
      label: "Terdahulu",
      icon: <Trophy className="w-4 h-4" />,
      count: stats.past,
    },
    {
      id: "all" as const,
      label: "Semua",
      icon: <BarChart3 className="w-4 h-4" />,
      count: stats.total,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-grey-100 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                  : "text-grey-700 hover:text-primary-600 hover:bg-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  activeTab === tab.id ? "bg-white/30" : "bg-grey-200"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
