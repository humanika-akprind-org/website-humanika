import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { MILESTONES_DATA, ACHIEVEMENTS_DATA } from "./constants";

export default function HistoryTab() {
  return (
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
            {MILESTONES_DATA.map((milestone, index) => (
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
                    <p className="text-grey-600">{milestone.description}</p>
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
            <h2 className="text-3xl font-bold mb-6">Pencapaian Terbaru</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS_DATA.map((item, index) => (
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
  );
}
