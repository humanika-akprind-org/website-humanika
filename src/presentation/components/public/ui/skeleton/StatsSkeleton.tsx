import { motion } from "framer-motion";

export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
        >
          {/* Icon placeholder */}
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-700/30 rounded-lg mb-4">
            <div className="w-6 h-6 bg-primary-600/50 rounded animate-pulse" />
          </div>

          {/* Number */}
          <div className="h-10 w-20 bg-primary-800/50 rounded-lg mx-auto mb-2 animate-pulse" />

          {/* Label */}
          <div className="h-4 w-24 bg-primary-700/30 rounded mx-auto animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
}
