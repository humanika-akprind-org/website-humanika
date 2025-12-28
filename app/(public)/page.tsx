"use client";

import Link from "next/link";
import ArticleSection from "@/components/public/ArticleSection";
import GallerySection from "@/components/public/GallerySection";
import UpcomingEventsSection from "@/components/public/UpcomingEventsSection";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  Calendar,
  Code,
  Target,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Lightbulb,
  HeartHandshake,
  Package,
} from "lucide-react";

interface Stat {
  number: string;
  label: string;
  icon: JSX.Element;
}

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([
    {
      number: "0",
      label: "Anggota Aktif",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      number: "0",
      label: "Kegiatan Tahunan",
      icon: <Calendar className="w-6 h-6 text-white" />,
    },
    {
      number: "0",
      label: "Proyek Kolaborasi",
      icon: <Package className="w-6 h-6 text-white" />,
    },
    {
      number: "0",
      label: "Penghargaan",
      icon: <Trophy className="w-6 h-6 text-white" />,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/stats`,
          { cache: "no-store" }
        );
        if (response.ok) {
          const data = await response.json();
          // Animate counting up
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
    setIsVisible(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-grey-50 to-white">
      {/* 1. Hero Section dengan Animasi */}
      <section className=" relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden rounded-bl-[100px] rounded-br-[100px]">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                              linear-gradient(to bottom, white 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary-800/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary-700/50">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Komunitas Informatika Terdepan
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Berinovasi,
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
                Berkarya,
              </span>
              <br />
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-white">
                  Berkolaborasi
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </span>
            </h1>

            <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              HUMANIKA menghimpun mahasiswa informatika untuk mengembangkan
              potensi, menciptakan inovasi, dan membangun komunitas yang
              berdampak melalui teknologi dan kolaborasi.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-2xl hover:shadow-primary-500/20"
                >
                  <span>Jelajahi HUMANIKA</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-red-500/20 border-0"
                >
                  <span>Bergabung Sekarang</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 * index + 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/15"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-700/30 rounded-lg mb-4 group-hover:scale-110 transition-transform text-white">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {loading ? (
                      <div className="h-10 w-20 bg-primary-800/50 rounded-lg animate-pulse mx-auto" />
                    ) : (
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                        {stat.number}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-primary-100/80">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* 2. Fitur Unggulan */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              MENGAPA HUMANIKA
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                Wadah Pengembangan
              </span>
              <br />
              Talenta Digital
            </h2>
            <p className="text-lg text-grey-600 max-w-2xl mx-auto">
              Kami menyediakan ekosistem yang mendukung pengembangan
              keterampilan teknis dan soft skills melalui berbagai program
              unggulan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: "Inovasi Teknologi",
                description:
                  "Mengembangkan solusi kreatif untuk masalah nyata melalui proyek kolaboratif dan kompetisi.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <HeartHandshake className="w-8 h-8" />,
                title: "Komunitas Kolaboratif",
                description:
                  "Jaringan profesional yang saling mendukung dalam pembelajaran dan pengembangan karir.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Pengembangan Karir",
                description:
                  "Pelatihan, workshop, dan mentoring untuk mempersiapkan karir di industri teknologi.",
                color: "from-purple-500 to-purple-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-8 rounded-2xl border border-grey-200 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-grey-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-grey-600 mb-6">{feature.description}</p>
                <Link
                  href="/programs"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group/link"
                >
                  Pelajari lebih lanjut
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Artikel Terbaru */}
      <div className="bg-gradient-to-b from-white to-grey-50">
        <ArticleSection />
      </div>

      {/* 4. Tentang Kami */}
      <section className="py-20 bg-gradient-to-br from-grey-50 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full blur-xl opacity-60" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-10">
                  <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    TENTANG KAMI
                  </div>
                  <h2 className="text-4xl font-bold text-grey-900 mb-6">
                    Mengenal <span className="text-primary-700">HUMANIKA</span>
                  </h2>
                  <p className="text-lg text-grey-700 mb-8 leading-relaxed">
                    HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi
                    mahasiswa yang mewadahi seluruh mahasiswa Program Studi
                    Informatika dalam berbagai kegiatan akademik dan
                    non-akademik untuk menciptakan lingkungan yang mendukung
                    pengembangan keterampilan teknis dan soft skills.
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-primary-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary-700">
                            500+
                          </div>
                          <div className="text-sm text-grey-600">
                            Anggota Aktif
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Code className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary-700">
                            20+
                          </div>
                          <div className="text-sm text-grey-600">
                            Proyek Aktif
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg"
                  >
                    <span>Pelajari Lebih Lanjut</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-grey-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-grey-900">
                      Visi Kami
                    </h3>
                    <p className="text-sm text-grey-500">
                      Masa Depan yang Kita Ciptakan
                    </p>
                  </div>
                </div>
                <p className="text-grey-700 text-lg leading-relaxed">
                  Menjadi wadah utama pengembangan talenta digital yang inovatif
                  dan kolaboratif untuk menciptakan dampak positif bagi
                  masyarakat melalui teknologi informasi.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Misi Kami</h3>
                    <p className="text-sm text-primary-200">
                      Komitmen untuk Berkontribusi
                    </p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    "Meningkatkan kompetensi anggota di bidang teknologi informasi",
                    "Menjalin kolaborasi dengan industri dan komunitas",
                    "Mengembangkan solusi inovatif untuk masalah sosial",
                    "Membangun ekosistem pembelajaran berkelanjutan",
                  ].map((mission, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary-300 rounded-full" />
                      </div>
                      <span>{mission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-grey-200 to-transparent h-px" />
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-grey-200" />
      </div>

      {/* 5. Event Terdekat */}
      <UpcomingEventsSection />

      {/* 6. Galeri */}
      <GallerySection />

      {/* 7. CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        </div>

        {/* Animated Elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-32 h-32 bg-primary-500/10 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-40 h-40 bg-primary-400/10 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 0, 360] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Mengembangkan
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-white">
                Potensi Digital Anda?
              </span>
            </h2>

            <p className="text-xl text-primary-100/90 mb-10 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas mahasiswa informatika terdepan.
              Dapatkan akses ke pelatihan eksklusif, proyek kolaboratif, dan
              jaringan profesional yang akan mempercepat perjalanan karir Anda.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-bold text-lg shadow-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Daftar Sekarang - Gratis!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-bold text-lg"
                >
                  <span>Jadwalkan Konsultasi</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <p className="text-primary-200/80 text-sm mt-8">
              Bergabung dengan 500+ anggota aktif yang telah mengembangkan
              proyek inovatif
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
