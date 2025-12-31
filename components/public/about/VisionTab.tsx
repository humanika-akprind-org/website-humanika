import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { MISSIONS_DATA, GOALS_DATA } from "./constants";

export default function VisionTab() {
  return (
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
              inovatif, kolaboratif, dan berdaya saing global untuk menciptakan
              dampak positif berkelanjutan dalam masyarakat digital.&quot;
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
          {MISSIONS_DATA.map((mission, index) => (
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
            {GOALS_DATA.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
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
  );
}
