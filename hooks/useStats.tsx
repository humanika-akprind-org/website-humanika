import { Briefcase, CalendarDays, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          data.forEach((stat: Stat, index: number) => {
            const targetNumber = parseInt(stat.number);
            if (targetNumber > 0) {
              animateCount(index, targetNumber);
            }
          });
          setStats((prev) =>
            prev.map((prevStat, index) => ({
              ...prevStat,
              number: data[index].number,
              label: data[index].label,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return { stats, loading };
};
