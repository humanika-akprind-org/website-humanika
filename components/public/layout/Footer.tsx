"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Konten utama footer */}
      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full mr-3">
                <Image
                  src="/logo.png"
                  alt="HUMANIKA"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              HUMANIKA
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Himpunan Mahasiswa Informatika yang berdedikasi untuk
              mengembangkan potensi mahasiswa di bidang teknologi informasi.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Menu
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/article"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  Article
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/event"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  Event
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Sosial Media
            </h3>
            <div className="flex space-x-4">
              {[
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
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} HIMPUNAN MAHASISWA INFORMATIKA
            (HUMANIKA). All rights reserved.
          </p>
        </div>
      </div>

      {/* HUMANIKA besar di bagian bawah yang terpotong */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="text-[60px] min-[490px]:text-[80px] sm:text-[120px] md:text-[150px] lg:text-[180px] xl:text-[240px] font-black tracking-wide text-gray-800 opacity-50 text-center -mb-6 min-[490px]:-mb-8 sm:-mb-12 md:-mb-14 lg:-mb-16 xl:-mb-20 leading-none">
          HUMANIKA
        </div>
      </div>
    </footer>
  );
}
