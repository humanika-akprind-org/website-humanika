import { motion } from "framer-motion";

interface CategoryPillsSkeletonProps {
  count?: number;
}

export default function CategoryPillsSkeleton({
  count = 5,
}: CategoryPillsSkeletonProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="h-10 w-24 bg-grey-200 rounded-full animate-pulse"
        />
      ))}
    </div>
  );
}
