"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, HeartHandshake, Target } from "lucide-react";

const features = [
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
];

export default function FeaturesSection() {
  return (
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
            Kami menyediakan ekosistem yang mendukung pengembangan keterampilan
            teknis dan soft skills melalui berbagai program unggulan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
  );
}
