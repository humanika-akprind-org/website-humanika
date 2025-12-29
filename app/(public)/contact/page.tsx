"use client";

import ContactForm from "@/components/public/contact/ContactForm";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telepon",
      value: "+62 812-3456-7890",
      gradient: "bg-blue-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "humanika@akprind.ac.id",
      gradient: "bg-purple-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Alamat",
      value: "Jl. Kalisahak No.28, Klitren, Yogyakarta",
      gradient: "bg-green-500",
    },
  ];

  const socialMedia = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/share/1BSXSNnrgp/",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/humanika_akprind?igsh=d2E4bW5oOTVoaDlt",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://x.com/HumanikaAKPRIND?t=eneYcjEgcmP0k6mNhKWm1w&s=09",
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      url: "https://youtube.com/@humanika.akprind1991?si=JZE3TaAS-lfM3uMD",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
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
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">HUBUNGI KAMI</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Mari Berkolaborasi
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
                Bersama HUMANIKA
              </span>
            </h1>

            <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Punya pertanyaan, ide, atau ingin berkolaborasi? Tim HUMANIKA siap
              membantu dan merespons dengan cepat untuk membangun koneksi yang
              bermakna.
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
                <span className="text-primary-200">Respons dalam 24 jam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-primary-200">100% Responsif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-primary-200">Support Multibahasa</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        {formSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Pesan Terkirim!</h3>
                    <p className="text-green-100">
                      Terima kasih telah menghubungi kami. Tim HUMANIKA akan
                      merespons pesan Anda dalam waktu 1-2 hari kerja.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-white hover:text-green-100"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-grey-200"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 ${info.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    >
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-grey-900 mb-3">
                        {info.title}
                      </h3>
                      <p className="text-grey-700 mt-2">{info.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold mb-4">Ikuti Kami</h2>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-grey-200">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
                    <Send className="w-4 h-4" />
                    <span className="text-sm font-medium">KIRIM PESAN</span>
                  </div>

                  <h2 className="text-3xl font-bold text-grey-900 mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                      Hubungi Kami
                    </span>
                  </h2>

                  <p className="text-grey-600">
                    Isi form berikut dan kami akan segera merespons
                  </p>
                </div>

                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-grey-200">
            <div className="p-8 border-b border-grey-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-grey-900">
                      Kunjungi Kami
                    </h2>
                  </div>
                  <p className="text-grey-600">
                    Jl. Kalisahak No.28, Klitren, Kec. Gondokusuman, Kota
                    Yogyakarta
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Universitas+AKPRIND+Indonesia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  <span>Buka di Google Maps</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="h-[400px] bg-grey-100 relative overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1976.5241078195088!2d110.38342661744383!3d-7.784712999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59ce29bc3887%3A0x2cad870b4a56cf1!2sUniversitas%20AKPRIND%20Indonesia!5e0!3m2!1sen!2sid!4v1763734370697!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />

              {/* Overlay Info */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                <h3 className="font-bold text-grey-900 mb-2">
                  Universitas AKPRIND
                </h3>
                <p className="text-sm text-grey-600">
                  Gedung Teknik Informatika, Lantai 3
                </p>
                <p className="text-sm text-grey-600 mt-1">
                  🕒 09:00 - 17:00 WIB
                </p>
              </div>
            </div>

            <div className="p-6 bg-grey-50 border-t border-grey-200">
              <div className="grid md:grid-cols-3 gap-6 text-sm text-grey-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Parkir luas tersedia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Akses transportasi umum mudah</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span>Fasilitas lengkap</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">PERTANYAAN UMUM</span>
              </div>

              <h2 className="text-3xl font-bold mb-6">
                Masih Punya Pertanyaan?
              </h2>

              <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                Jelajahi FAQ kami untuk jawaban cepat atau jadwalkan konsultasi
                langsung dengan tim HUMANIKA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/faq"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <span>Lihat FAQ</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/consultation"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  <span>Jadwalkan Konsultasi</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
