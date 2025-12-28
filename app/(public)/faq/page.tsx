"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ChevronRight,
  HelpCircle,
  Search,
  X,
  Mail,
  UserPlus,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Apa itu HUMANIKA?",
    answer:
      "HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi mahasiswa yang mewadahi seluruh mahasiswa Program Studi Informatika dalam berbagai kegiatan akademik dan non-akademik. Kami berkomitmen untuk menciptakan lingkungan yang mendukung pengembangan keterampilan teknis dan soft skills.",
  },
  {
    question: "Bagaimana cara bergabung dengan HUMANIKA?",
    answer:
      "Untuk bergabung dengan HUMANIKA, Anda dapat mendaftar melalui website kami di halaman registrasi. Pastikan Anda adalah mahasiswa aktif Program Studi Informatika dan mengikuti proses seleksi yang telah ditentukan.",
  },
  {
    question: "Apa saja persyaratan untuk bergabung dengan HUMANIKA?",
    answer:
      "Persyaratan utama adalah menjadi mahasiswa aktif Program Studi Informatika. Selain itu, Anda perlu mengisi formulir pendaftaran, mengikuti proses seleksi, dan berkomitmen untuk aktif dalam kegiatan organisasi.",
  },
  {
    question: "Apa saja kegiatan yang diselenggarakan HUMANIKA?",
    answer:
      "HUMANIKA menyelenggarakan berbagai kegiatan seperti workshop teknologi, seminar, kompetisi programming, kegiatan sosial, dan proyek kolaborasi. Kami juga memiliki divisi-divisi khusus untuk pengembangan skill di bidang tertentu.",
  },
  {
    question: "Apa saja divisi yang tersedia di HUMANIKA?",
    answer:
      "HUMANIKA memiliki beberapa divisi seperti Divisi Pemberdayaan Sumber Daya Mahasiswa, Informasi dan Komunikasi, Divisi Penelitian dan Pengembangan, dan Divisi Wirausaha. Setiap divisi fokus pada pengembangan skill di bidangnya masing-masing.",
  },
  {
    question: "Bagaimana cara terlibat dalam kegiatan HUMANIKA?",
    answer:
      "Anda dapat terlibat dengan mengikuti kegiatan yang diumumkan melalui website, media sosial, atau grup komunikasi HUMANIKA. Anggota aktif juga dapat mengajukan proposal kegiatan atau bergabung dalam tim penyelenggara.",
  },
  {
    question: "Apakah HUMANIKA memberikan sertifikat untuk kegiatan?",
    answer:
      "Ya, HUMANIKA menyediakan sertifikat bagi peserta yang mengikuti kegiatan kami. Sertifikat ini dapat digunakan untuk portofolio akademik dan profesional Anda.",
  },
  {
    question: "Apa manfaat bergabung dengan HUMANIKA?",
    answer:
      "Bergabung dengan HUMANIKA memberikan kesempatan untuk mengembangkan skill teknis, networking dengan profesional IT, pengalaman organisasi, sertifikat kegiatan, dan kesempatan untuk berkontribusi dalam proyek-proyek inovatif.",
  },
  {
    question: "Seberapa sering HUMANIKA mengadakan pertemuan?",
    answer:
      "HUMANIKA mengadakan pertemuan rutin mingguan untuk koordinasi internal, serta kegiatan-kegiatan khusus sesuai dengan program kerja. Jadwal lengkap dapat dilihat di kalender kegiatan kami.",
  },
  {
    question: "Apakah alumni dapat tetap terhubung dengan HUMANIKA?",
    answer:
      "Ya, HUMANIKA memiliki komunitas alumni yang tetap terhubung. Alumni dapat bergabung dalam mentoring program, networking events, dan kontribusi untuk pengembangan organisasi.",
  },
  {
    question: "Jenis proyek apa yang dikerjakan HUMANIKA?",
    answer:
      "HUMANIKA mengerjakan berbagai proyek seperti pengembangan aplikasi, website, sistem informasi, proyek riset, dan kolaborasi dengan industri. Proyek-proyek ini memberikan pengalaman praktis bagi anggota.",
  },
  {
    question: "Bagaimana cara mengajukan ide atau inisiatif baru?",
    answer:
      "Anda dapat mengajukan ide melalui pengurus HUMANIKA atau melalui forum diskusi anggota. Tim kami akan meninjau proposal Anda dan mendiskusikan kemungkinan implementasinya.",
  },
  {
    question: "Bagaimana cara menghubungi HUMANIKA?",
    answer:
      "Anda dapat menghubungi kami melalui halaman kontak di website ini, atau mengikuti media sosial HUMANIKA untuk informasi terkini. Kami juga memiliki email resmi dan grup komunikasi untuk anggota.",
  },
  {
    question: "Apakah HUMANIKA hanya untuk mahasiswa informatika?",
    answer:
      "Ya, HUMANIKA khusus untuk mahasiswa Program Studi Informatika. Namun, kami terbuka untuk berkolaborasi dengan mahasiswa dari jurusan lain dalam kegiatan bersama.",
  },
  {
    question: "Kapan periode pendaftaran anggota baru?",
    answer:
      "Pendaftaran anggota baru biasanya dibuka setiap awal semester. Informasi terkini mengenai jadwal pendaftaran dapat dilihat di website atau media sosial HUMANIKA.",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">FAQ</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Pertanyaan Umum
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
                Tentang HUMANIKA
              </span>
            </h1>

            <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Temukan jawaban atas pertanyaan-pertanyaan yang sering ditanyakan
              tentang HUMANIKA, keanggotaan, kegiatan, dan segala hal yang
              perlu Anda ketahui.
            </p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {faqs.length} Pertanyaan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-primary-200">Update Terkini</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-primary-200">Informasi Valid</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl border border-grey-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-grey-400 hover:text-grey-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-grey-600"
            >
              Ditemukan {filteredFaqs.length} pertanyaan untuk &quot;
              {searchTerm}&quot;
            </motion.p>
          )}
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 6) }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-grey-200 cursor-pointer transition-all duration-300 ${
                    expandedIndex === index ? "ring-2 ring-primary-500" : ""
                  }`}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-grey-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {faq.question}
                      </h3>
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          expandedIndex === index
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-grey-700 leading-relaxed pt-2">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-primary-600 font-medium">
                          {expandedIndex === index ? "Sembunyikan" : "Baca jawaban"}
                        </span>
                        <ChevronRight
                          className={`w-5 h-5 text-grey-400 transition-transform ${
                            expandedIndex === index ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-primary-900 to-primary-950 rounded-2xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">BUTUH BANTUAN?</span>
                </div>

                <h2 className="text-3xl font-bold mb-6">
                  Masih Ada Pertanyaan?
                </h2>

                <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Jika pertanyaan Anda tidak terjawab di atas, jangan ragu untuk
                  menghubungi kami. Tim HUMANIKA siap membantu Anda dengan
                  senang hati.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Hubungi Kami</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/auth/register"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Daftar Sekarang</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-grey-200"
          >
            <h3 className="text-2xl font-bold text-grey-900 mb-8 text-center">
              Informasi Lainnya
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/about"
                className="group p-6 bg-grey-50 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <h4 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-primary-700">
                  Tentang Kami
                </h4>
                <p className="text-grey-600 text-sm">
                  Pelajari lebih lanjut tentang visi, misi, dan struktur organisasi HUMANIKA
                </p>
              </Link>
              <Link
                href="/activities"
                className="group p-6 bg-grey-50 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <h4 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-primary-700">
                  Kegiatan
                </h4>
                <p className="text-grey-600 text-sm">
                  Jelajahi berbagai kegiatan dan program yang kami selenggarakan
                </p>
              </Link>
              <Link
                href="/membership"
                className="group p-6 bg-grey-50 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <h4 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-primary-700">
                  Keanggotaan
                </h4>
                <p className="text-grey-600 text-sm">
                  Informasi lengkap tentang manfaat dan proses keanggotaan
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}