import { Briefcase, CalendarDays, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useActivePeriodStatistic } from "@/hooks/statistic/useStatistics";

interface Stat {
  number: string;
  label: string;
  icon: JSX.Element;
}

const initialStats: Stat[] = [
  {
    number: "0",
    label: "Anggota Aktif",
    icon: <Users className="h-6 w-6" />,
  },
  {
    number: "0",
    label: "Kegiatan Tahunan",
    icon: <CalendarDays className="h-6 w-6" />,
  },
  {
    number: "0",
    label: "Proyek Kolaborasi",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    number: "0",
    label: "Penghargaan",
    icon: <TrendingUp className="h-6 w-6" />,
  },
];

export const useStats = () => {
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const { statistic, isLoading } = useActivePeriodStatistic();

  useEffect(() => {
    if (statistic) {
      const newStats = [
        {
          number: statistic.activeMembers.toString(),
          label: "Anggota Aktif",
          icon: <Users className="h-6 w-6" />,
        },
        {
          number: statistic.annualEvents.toString(),
          label: "Kegiatan Tahunan",
          icon: <CalendarDays className="h-6 w-6" />,
        },
        {
          number: statistic.collaborativeProjects.toString(),
          label: "Proyek Kolaborasi",
          icon: <Briefcase className="h-6 w-6" />,
        },
        {
          number: statistic.awards.toString(),
          label: "Penghargaan",
          icon: <TrendingUp className="h-6 w-6" />,
        },
      ];

      newStats.forEach((stat, index) => {
        const targetNumber = parseInt(stat.number);
        if (targetNumber > 0) {
          animateCount(index, targetNumber);
        }
      });

      setStats(newStats);
    }
  }, [statistic]);

  const animateCount = (index: number, target: number) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setStats((prev) => {
        const newStats = [...prev];
        newStats[index] = {
          ...newStats[index],
          number: Math.floor(current).toString(),
        };
        return newStats;
      });
    }, 30);
  };

  return { stats, loading: isLoading };
};
