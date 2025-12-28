"use client";

import "@/app/error.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);

  useEffect(() => {
    setIsVisible(true);

    // Create particles for error effect
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
    }));
    setParticles(newParticles);

    // Trigger shake animation
    setTimeout(() => setShake(true), 300);
    setTimeout(() => setShake(false), 800);
  }, []);

  const errorDetails = error?.digest ? `ID Error: ${error.digest}` : "";

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-red-50 via-white to-grey-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #dc2626 1px, transparent 1px),
                              linear-gradient(to bottom, #dc2626 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full mb-6">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Error 500</span>
            </div>
          </motion.div>

          {/* Large 500 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-9xl font-bold text-red-600 mb-4">500</h1>
            <p className="text-2xl text-grey-600">Kesalahan Server Internal</p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-10 border border-red-200">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-grey-900 mb-4">
                  Terjadi Kesalahan
                </h3>
                <p className="text-grey-600 mb-8">
                  Maaf, terjadi kesalahan tak terduga di server. Silakan coba
                  lagi atau hubungi tim support kami jika masalah berlanjut.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={reset}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Coba Lagi
                  </button>

                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold"
                  >
                    <Mail className="w-5 h-5" />
                    Hubungi Support
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-grey-500">
              <span>HTTP 500 • Internal Server Error</span>
              <span className="w-1 h-1 bg-grey-300 rounded-full" />
              <span>HUMANIKA Platform</span>
              <span className="w-1 h-1 bg-grey-300 rounded-full" />
              <span>Timestamp: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
