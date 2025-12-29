"use client";

import { useState, useEffect } from "react";
import type { OrganizationalStructure } from "@/types/structure";
import StructureAvatar from "@/components/admin/ui/avatar/ImageView";
import {
  Target,
  Users,
  Calendar,
  Code,
  Award,
  TrendingUp,
  BookOpen,
  Heart,
  Globe,
  Lightbulb,
  ChevronRight,
  Sparkles,
  History,
  Trophy,
  Briefcase,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "vision" | "history">(
    "about"
  );

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await fetch("/api/structure?status=PUBLISH");
        if (response.ok) {
          const data = await response.json();
          setStructures(data || []);
        } else {
          setError("Failed to load organizational structure");
        }
      } catch (_err) {
        setError("Failed to load organizational structure");
      } finally {
        setLoading(false);
      }
    };

    fetchStructures();
  }, []);

  // Get the latest published structure
  const latestStructure = structures.length > 0 ? structures[0] : null;

  // Stats data
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "200+",
      label: "Anggota Aktif",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      value: "50+",
      label: "Event Tahunan",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Code className="w-6 h-6" />,
      value: "30+",
      label: "Proyek Inovasi",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "15+",
      label: "Penghargaan",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "95%",
      label: "Kepuasan Anggota",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: "100+",
      label: "Materi Pembelajaran",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2005",
      title: "Pendirian",
      description: "HUMANIKA didirikan sebagai wadah mahasiswa informatika",
    },
    {
      year: "2010",
      title: "Ekspansi",
      description: "Memperluas jaringan dengan industri dan komunitas",
    },
    {
      year: "2015",
      title: "Digitalisasi",
      description: "Transformasi digital dan pengembangan platform online",
    },
    {
      year: "2020",
      title: "Inovasi",
      description: "Fokus pada proyek teknologi berdampak sosial",
    },
    {
      year: "2024",
      title: "Globalisasi",
      description: "Kolaborasi internasional dan standar global",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-grey-50 to-white overflow-x-hidden">
      {/* Hero Section */}
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
              {stats.map((stat, index) => (
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

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg shadow-sm border-b border-grey-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-1 p-2 bg-grey-100 rounded-xl">
              {[
                {
                  id: "about",
                  label: "Tentang Kami",
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  id: "vision",
                  label: "Visi & Misi",
                  icon: <Target className="w-4 h-4" />,
                },
                {
                  id: "history",
                  label: "Sejarah",
                  icon: <History className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "about" | "vision" | "history")
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                      : "text-grey-700 hover:text-primary-600 hover:bg-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* About Tab */}
        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Introduction */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  PERKENALAN
                </div>

                <h2 className="text-4xl font-bold text-grey-900 mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                    Apa Itu
                  </span>{" "}
                  HUMANIKA?
                </h2>

                <div className="space-y-4 text-lg text-grey-700 leading-relaxed">
                  <p>
                    <span className="font-semibold text-primary-700">
                      HUMANIKA
                    </span>{" "}
                    (Himpunan Mahasiswa Informatika) adalah organisasi mahasiswa
                    yang didirikan pada tahun 2005 sebagai wadah pengembangan
                    talenta digital di lingkungan akademik.
                  </p>
                  <p>
                    Kami berkomitmen untuk menciptakan ekosistem yang mendukung
                    pengembangan keterampilan teknis dan soft skills mahasiswa
                    informatika melalui berbagai program terstruktur, pelatihan,
                    dan kolaborasi dengan industri.
                  </p>
                  <p>
                    Dengan lebih dari 15 tahun pengalaman, kami telah melahirkan
                    ratusan profesional IT yang berkontribusi di berbagai
                    sektor, baik nasional maupun internasional.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        icon: <GraduationCap className="w-8 h-8" />,
                        title: "Pendidikan",
                        description: "Program pembelajaran dan workshop",
                      },
                      {
                        icon: <Briefcase className="w-8 h-8" />,
                        title: "Karir",
                        description: "Kesempatan magang dan jaringan industri",
                      },
                      {
                        icon: <Code className="w-8 h-8" />,
                        title: "Proyek",
                        description: "Pengembangan solusi teknologi nyata",
                      },
                      {
                        icon: <Globe className="w-8 h-8" />,
                        title: "Komunitas",
                        description: "Jaringan alumni dan profesional",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-xl shadow-lg border border-grey-200"
                      >
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4">
                          <div className="text-primary-600">{item.icon}</div>
                        </div>
                        <h3 className="font-bold text-grey-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-grey-600">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  NILAI-NILAI KAMI
                </div>
                <h2 className="text-4xl font-bold text-grey-900 mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                    Prinsip yang Kami
                  </span>{" "}
                  Anut
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Heart className="w-8 h-8" />,
                    title: "Kolaborasi",
                    description:
                      "Kami percaya kekuatan terbesar berasal dari kerja sama dan saling mendukung dalam tim.",
                    color: "from-red-500 to-red-600",
                  },
                  {
                    icon: <Lightbulb className="w-8 h-8" />,
                    title: "Inovasi",
                    description:
                      "Terus mendorong batas kreativitas untuk menciptakan solusi teknologi yang berdampak.",
                    color: "from-yellow-500 to-yellow-600",
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "Integritas",
                    description:
                      "Bertindak dengan jujur, transparan, dan bertanggung jawab dalam setiap langkah.",
                    color: "from-blue-500 to-blue-600",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-grey-200 transition-all duration-300"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{value.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-grey-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-grey-600 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Vision & Mission Tab */}
        {activeTab === "vision" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 text-white">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Target className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary-200 uppercase tracking-wider">
                      ARAH & TUJUAN
                    </div>
                    <h2 className="text-3xl font-bold">Visi Kami</h2>
                  </div>
                </div>

                <div className="max-w-3xl">
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed text-primary-100">
                    &quot;Menjadi wadah utama pengembangan talenta digital yang
                    inovatif, kolaboratif, dan berdaya saing global untuk
                    menciptakan dampak positif berkelanjutan dalam masyarakat
                    digital.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  STRATEGI PENCAPAIAN
                </div>
                <h2 className="text-4xl font-bold text-grey-900 mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                    Misi
                  </span>{" "}
                  yang Kami Jalankan
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    number: "01",
                    title: "Pengembangan Kompetensi",
                    description:
                      "Meningkatkan keterampilan teknis dan soft skills melalui program pelatihan terstruktur.",
                    icon: <GraduationCap className="w-6 h-6" />,
                  },
                  {
                    number: "02",
                    title: "Jaringan Industri",
                    description:
                      "Membangun dan memperkuat kolaborasi dengan perusahaan teknologi terkemuka.",
                    icon: <Briefcase className="w-6 h-6" />,
                  },
                  {
                    number: "03",
                    title: "Inovasi Teknologi",
                    description:
                      "Mendorong penelitian dan pengembangan solusi teknologi yang berdampak sosial.",
                    icon: <Lightbulb className="w-6 h-6" />,
                  },
                  {
                    number: "04",
                    title: "Kontribusi Sosial",
                    description:
                      "Menerapkan teknologi untuk memecahkan masalah nyata dalam masyarakat.",
                    icon: <Heart className="w-6 h-6" />,
                  },
                ].map((mission, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border border-grey-200 group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-5xl font-black text-primary-100 group-hover:text-primary-200 transition-colors">
                        {mission.number}
                      </div>
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                        <div className="text-primary-600">{mission.icon}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-grey-900 mb-3">
                      {mission.title}
                    </h3>
                    <p className="text-grey-600 text-sm leading-relaxed">
                      {mission.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-grey-50 rounded-2xl p-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-grey-900 mb-8 text-center">
                  Target Kami hingga 2025
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { goal: "500+ Anggota Aktif", progress: 80 },
                    { goal: "100+ Proyek Inovasi", progress: 65 },
                    { goal: "50+ Partner Industri", progress: 70 },
                    { goal: "10+ Penghargaan Nasional", progress: 90 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-grey-900">
                          {item.goal}
                        </span>
                        <span className="font-bold text-primary-600">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-grey-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Timeline */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  PERJALANAN KAMI
                </div>
                <h2 className="text-4xl font-bold text-grey-900 mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                    Sejarah & Pencapaian
                  </span>{" "}
                  HUMANIKA
                </h2>
              </div>

              <div className="relative max-w-6xl mx-auto">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-primary-300" />

                {/* Milestones */}
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex items-center ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Content */}
                      <div
                        className={`w-1/2 ${
                          index % 2 === 0 ? "pr-8 text-right" : "pl-8"
                        }`}
                      >
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-grey-200">
                          <div className="inline-flex items-center gap-2 text-primary-600 font-bold text-lg mb-2">
                            <Trophy className="w-5 h-5" />
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-grey-900 mb-3">
                            {milestone.title}
                          </h3>
                          <p className="text-grey-600">
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      {/* Year Marker */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {milestone.year}
                          </span>
                        </div>
                      </div>

                      {/* Empty Space */}
                      <div className="w-1/2" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">PRESTASI</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-6">
                    Pencapaian Terbaru
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      year: "2023",
                      achievement: "Juara 1 Nasional Hackathon AI",
                      category: "Kompetisi",
                    },
                    {
                      year: "2022",
                      achievement: "Partner Google Developer Student Clubs",
                      category: "Kolaborasi",
                    },
                    {
                      year: "2021",
                      achievement: "Best Student Organization Award",
                      category: "Penghargaan",
                    },
                    {
                      year: "2020",
                      achievement: "Launching Platform E-Learning",
                      category: "Inovasi",
                    },
                    {
                      year: "2019",
                      achievement: "500+ Alumni Berkarir di Tech Giant",
                      category: "Karir",
                    },
                    {
                      year: "2018",
                      achievement: "International Research Publication",
                      category: "Riset",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    >
                      <div className="text-primary-200 text-sm font-medium mb-2">
                        {item.year} • {item.category}
                      </div>
                      <h3 className="text-lg font-semibold mb-3">
                        {item.achievement}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Organizational Structure Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              STRUKTUR ORGANISASI
            </div>
            <h2 className="text-4xl font-bold text-grey-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                Kepemimpinan & Tim
              </span>{" "}
              Kami
            </h2>
            <p className="text-grey-600 max-w-2xl mx-auto">
              Kenali tim kepemimpinan yang membawa HUMANIKA menuju visi dan misi
              yang telah ditetapkan.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-grey-200">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <p className="mt-4 text-grey-600 font-medium">
                  Memuat struktur organisasi...
                </p>
              </div>
            ) : error || !latestStructure ? (
              <div className="text-center py-16">
                <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-grey-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-grey-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-grey-900 mb-2">
                      {error || "Struktur Belum Tersedia"}
                    </h3>
                    <p className="text-grey-600">
                      {error
                        ? "Silakan coba lagi nanti"
                        : "Struktur organisasi sedang dalam proses pembaruan"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-grey-900">
                      {latestStructure.name}
                    </h3>
                    <p className="text-grey-600">
                      Periode{" "}
                      {new Date(latestStructure.createdAt).getFullYear()}
                    </p>
                  </div>
                  <Link
                    href="/structure"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="border-2 border-dashed border-grey-200 rounded-xl p-8 bg-grey-50 flex justify-center items-center">
                  <StructureAvatar
                    imageUrl={latestStructure.structure}
                    alt={latestStructure.name}
                    size={{ width: 1600, height: 900 }}
                    modalTitle={`Struktur Organisasi ${latestStructure.name}`}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Join CTA */}
        <section className="mt-20">
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">GABUNG BERSAMA KAMI</span>
              </div>

              <h2 className="text-4xl font-bold mb-6">
                Siap Mengembangkan Potensi Digital Anda?
              </h2>

              <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                Bergabunglah dengan komunitas mahasiswa informatika terdepan.
                Dapatkan akses ke pelatihan eksklusif, proyek kolaboratif, dan
                jaringan profesional yang akan mempercepat perjalanan karir
                Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <span>Daftar Sekarang</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  <span>Konsultasi Gratis</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
