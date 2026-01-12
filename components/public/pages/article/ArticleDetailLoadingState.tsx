import { motion } from "framer-motion";
import CategoryPillsSkeleton from "@/components/public/ui/skeleton/CategoryPillsSkeleton";

export default function ArticleDetailLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-4 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
          </div>

          {/* Title */}
          <div className="max-w-4xl mx-auto text-center mb-6">
            <div className="h-12 w-3/4 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="h-12 w-1/2 bg-white/20 rounded-lg mx-auto mt-4 animate-pulse" />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-5 w-28 bg-white/20 rounded animate-pulse" />
            <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
          </div>

          {/* Category Pills */}
          <div className="mt-6">
            <CategoryPillsSkeleton count={3} />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="w-full h-[400px] bg-grey-200 rounded-2xl animate-pulse mb-12" />

          {/* Content Skeleton */}
          <div className="space-y-8">
            {/* Paragraphs */}
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="h-6 w-full bg-grey-200 rounded animate-pulse" />
                <div className="h-6 w-5/6 bg-grey-200 rounded animate-pulse" />
                <div className="h-6 w-4/6 bg-grey-200 rounded animate-pulse" />
              </motion.div>
            ))}

            {/* Quote */}
            <div className="border-l-4 border-primary-300 pl-6 py-2 my-8">
              <div className="h-8 w-3/4 bg-grey-200 rounded animate-pulse" />
            </div>

            {/* More Paragraphs */}
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={`para-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (6 + index) * 0.1 }}
                className="space-y-3"
              >
                <div className="h-6 w-full bg-grey-200 rounded animate-pulse" />
                <div className="h-6 w-5/6 bg-grey-200 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-grey-200">
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={`tag-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (10 + index) * 0.05 }}
                  className="h-8 w-20 bg-primary-100 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Skeleton */}
      <div className="bg-grey-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 w-48 bg-grey-200 rounded animate-pulse mb-8" />

            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="h-40 bg-grey-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-20 bg-primary-100 rounded-full animate-pulse" />
                    <div className="h-6 w-full bg-grey-200 rounded animate-pulse" />
                    <div className="h-6 w-3/4 bg-grey-200 rounded animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
