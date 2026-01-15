import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Calendar,
  Code,
  Award,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { useActivePeriodStatistic } from "@/hooks/statistic/useStatistics";

// Fallback data when API is loading or fails
const FALLBACK_STATS_DATA = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "0+",
    label: "Anggota Aktif",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    value: "0+",
    label: "Event Tahunan",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Code className="w-6 h-6" />,
    value: "0+",
    label: "Proyek Inovasi",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <Award className="w-6 h-6" />,
    value: "0+",
    label: "Penghargaan",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "0%",
    label: "Kepuasan Anggota",
    color: "from-red-500 to-red-600",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    value: "0+",
    label: "Materi Pembelajaran",
    color: "from-cyan-500 to-cyan-600",
  },
];

// Format number with + suffix if > threshold
const formatStatValue = (value: number, threshold: number = 100): string => {
  if (value >= threshold) {
    return `${value}+`;
  }
  return value.toString();
};

export default function HeroSection() {
  const { statistic, isLoading } = useActivePeriodStatistic();

  // Transform API data to stats format, fallback to hardcoded data
  const statsData = statistic
    ? [
        {
          icon: <Users className="w-6 h-6" />,
          value: formatStatValue(statistic.activeMembers),
          label: "Anggota Aktif",
          color: "from-blue-500 to-blue-600",
        },
        {
          icon: <Calendar className="w-6 h-6" />,
          value: formatStatValue(statistic.annualEvents),
          label: "Event Tahunan",
          color: "from-purple-500 to-purple-600",
        },
        {
          icon: <Code className="w-6 h-6" />,
          value: formatStatValue(statistic.innovationProjects),
          label: "Proyek Inovasi",
          color: "from-green-500 to-green-600",
        },
        {
          icon: <Award className="w-6 h-6" />,
          value: formatStatValue(statistic.awards),
          label: "Penghargaan",
          color: "from-orange-500 to-orange-600",
        },
        {
          icon: <TrendingUp className="w-6 h-6" />,
          value: `${statistic.memberSatisfaction}%`,
          label: "Kepuasan Anggota",
          color: "from-red-500 to-red-600",
        },
        {
          icon: <BookOpen className="w-6 h-6" />,
          value: formatStatValue(statistic.learningMaterials),
          label: "Materi Pembelajaran",
          color: "from-cyan-500 to-cyan-600",
        },
      ]
    : FALLBACK_STATS_DATA;

  return (
    <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-primary-800 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">PROFIL ORGANISASI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
              Mengenal
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
              HUMANIKA
            </span>
          </h1>

          <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Himpunan Mahasiswa Informatika terdepan yang berkomitmen
            mengembangkan talenta digital, menciptakan inovasi teknologi, dan
            membangun komunitas yang berdampak positif.
          </p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16"
          >
            {isLoading
              ? // Loading skeleton
                FALLBACK_STATS_DATA.map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3 mx-auto animate-pulse" />
                    <div className="h-8 bg-white/20 rounded mb-1 mx-auto animate-pulse w-16" />
                    <div className="h-4 bg-white/20 rounded mx-auto animate-pulse w-24" />
                  </motion.div>
                ))
              : // Actual stats data
                statsData.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -5 }}
                    className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg mb-3 mx-auto`}
                    >
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-primary-200">{stat.label}</div>
                  </motion.div>
                ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
