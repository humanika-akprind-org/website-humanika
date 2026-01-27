import { motion } from "framer-motion";

interface CardSkeletonProps {
  count?: number;
  gridClass?: string;
}

export default function CardSkeleton({
  count = 6,
  gridClass = "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
}: CardSkeletonProps) {
  return (
    <div className={gridClass}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
        >
          {/* Image placeholder */}
          <div className="h-48 bg-grey-200 animate-pulse" />

          <div className="p-6 space-y-4">
            {/* Category/Badge */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-primary-100 rounded-full animate-pulse" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-grey-200 rounded animate-pulse" />
              <div className="h-6 w-1/2 bg-grey-200 rounded animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-grey-100 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-grey-100 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-grey-100 rounded animate-pulse" />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-grey-100 flex items-center justify-between">
              <div className="h-4 w-24 bg-grey-100 rounded animate-pulse" />
              <div className="h-8 w-28 bg-primary-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
