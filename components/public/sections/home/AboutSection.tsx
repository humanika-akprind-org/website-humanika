"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Code, Target, CheckCircle } from "lucide-react";
import { useActivePeriodOrganizationContact } from "@/hooks/organization-contact/useOrganizationContacts";
import { useActivePeriodStatistic } from "@/hooks/statistic/useStatistics";

export default function AboutSection() {
  const { organizationContact, isLoading: orgLoading } =
    useActivePeriodOrganizationContact();
  const { statistic, isLoading: statLoading } = useActivePeriodStatistic();

  // Handle mission array from database (stored as Json)
  const missions = organizationContact?.mission
    ? Array.isArray(organizationContact.mission)
      ? organizationContact.mission.filter(
          (m): m is string => typeof m === "string"
        )
      : typeof organizationContact.mission === "string"
      ? organizationContact.mission.split("\n").filter((m) => m.trim())
      : []
    : [
        "Meningkatkan kompetensi anggota di bidang teknologi informasi",
        "Menjalin kolaborasi dengan industri dan komunitas",
        "Mengembangkan solusi inovatif untuk masalah sosial",
        "Membangun ekosistem pembelajaran berkelanjutan",
      ];

  return (
    <section className="py-20 bg-gradient-to-br from-grey-50 to-primary-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
                  Informatika dalam berbagai kegiatan akademik dan non-akademik
                  untuk menciptakan lingkungan yang mendukung pengembangan
                  keterampilan teknis dan soft skills.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading ? "..." : statistic?.activeMembers || 0}
                        </div>
                        <div className="text-xs text-grey-600">
                          Anggota Aktif
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading
                            ? "..."
                            : statistic?.collaborativeProjects || 0}
                        </div>
                        <div className="text-xs text-grey-600">
                          Proyek Kolaboratif
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading
                            ? "..."
                            : statistic?.innovationProjects || 0}
                        </div>
                        <div className="text-xs text-grey-600">
                          Proyek Inovasi
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading
                            ? "..."
                            : statistic?.memberSatisfaction || 0}
                          %
                        </div>
                        <div className="text-xs text-grey-600">
                          Kepuasan Anggota
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
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-grey-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-grey-900">Visi Kami</h3>
                  <p className="text-sm text-grey-500">
                    Masa Depan yang Kita Ciptakan
                  </p>
                </div>
              </div>
              <p className="text-grey-700 text-lg leading-relaxed">
                {orgLoading
                  ? "Memuat visi..."
                  : organizationContact?.vision ||
                    "Menjadi wadah utama pengembangan talenta digital yang inovatif dan kolaboratif untuk menciptakan dampak positif bagi masyarakat melalui teknologi informasi."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-xl p-8 text-white">
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
                {missions.map((mission, index) => (
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
  );
}
