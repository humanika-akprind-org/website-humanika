import { motion } from "framer-motion";
import { CONTACT_INFO, SOCIAL_MEDIA } from "../../contact/constants";

export default function ContactInfoSection() {
  return (
    <div className="space-y-8">
      {/* Contact Cards */}
      <div className="space-y-6">
        {CONTACT_INFO.map((info, index) => (
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
          {SOCIAL_MEDIA.map((social, index) => (
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
  );
}
