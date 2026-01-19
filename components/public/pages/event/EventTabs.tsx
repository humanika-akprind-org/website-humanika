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
      className="mb-6 md:mb-8"
    >
      <div className="flex justify-center">
        {/* Mobile: horizontal scroll container */}
        <div className="w-full overflow-x-auto scrollbar-hide px-4 md:px-0">
          {/* Desktop: centered inline-flex, Mobile: flex with gap */}
          <div className="flex justify-center md:inline-flex rounded-xl bg-grey-100 p-1.5 md:p-2 min-w-max md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                    : "text-grey-700 hover:text-primary-600 hover:bg-white"
                }`}
              >
                {tab.icon}
                {/* Show full label on md+, abbreviated on mobile */}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">
                  {tab.id === "upcoming" && "Mdtng"}
                  {tab.id === "ongoing" && "Berlgsg"}
                  {tab.id === "past" && "Tdhulu"}
                  {tab.id === "all" && "Semua"}
                </span>
                <span
                  className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full ${
                    activeTab === tab.id ? "bg-white/30" : "bg-grey-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
