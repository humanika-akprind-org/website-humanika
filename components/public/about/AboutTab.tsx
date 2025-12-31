import { motion } from "framer-motion";
import { VALUES_DATA, FEATURES_DATA } from "./constants";

export default function AboutTab() {
  return (
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
              <span className="font-semibold text-primary-700">HUMANIKA</span>{" "}
              (Himpunan Mahasiswa Informatika) adalah organisasi mahasiswa yang
              didirikan pada tahun 2005 sebagai wadah pengembangan talenta
              digital di lingkungan akademik.
            </p>
            <p>
              Kami berkomitmen untuk menciptakan ekosistem yang mendukung
              pengembangan keterampilan teknis dan soft skills mahasiswa
              informatika melalui berbagai program terstruktur, pelatihan, dan
              kolaborasi dengan industri.
            </p>
            <p>
              Dengan lebih dari 15 tahun pengalaman, kami telah melahirkan
              ratusan profesional IT yang berkontribusi di berbagai sektor, baik
              nasional maupun internasional.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-6">
              {FEATURES_DATA.map(
                (
                  item: {
                    icon: JSX.Element;
                    title: string;
                    description: string;
                  },
                  index: number
                ) => (
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
                    <p className="text-sm text-grey-600">{item.description}</p>
                  </motion.div>
                )
              )}
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
          {VALUES_DATA.map(
            (
              value: {
                icon: JSX.Element;
                title: string;
                description: string;
                color: string;
              },
              index: number
            ) => (
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
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
