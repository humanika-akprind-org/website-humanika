import { motion } from "framer-motion";

export default function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="aspect-square bg-grey-200 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="w-full h-full bg-gradient-to-br from-grey-100 to-grey-200" />
        </motion.div>
      ))}
    </div>
  );
}
