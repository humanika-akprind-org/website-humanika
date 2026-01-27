import { motion } from "framer-motion";
export default function EventDetailLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 bg-white/20 rounded-lg animate-pulse" />
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="h-6 w-28 bg-white/20 rounded-full animate-pulse" />
          </div>

          {/* Title */}
          <div className="max-w-4xl mx-auto text-center mb-6">
            <div className="h-12 w-3/4 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="h-12 w-1/2 bg-white/20 rounded-lg mx-auto mt-4 animate-pulse" />
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
              <div className="h-5 w-40 bg-white/20 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
              <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
              <div className="h-5 w-28 bg-white/20 rounded animate-pulse" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
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

          {/* Description Skeleton */}
          <div className="space-y-8">
            <div>
              <div className="h-8 w-48 bg-grey-200 rounded animate-pulse mb-4" />
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3 mb-4"
                >
                  <div className="h-6 w-full bg-grey-200 rounded animate-pulse" />
                  <div className="h-6 w-5/6 bg-grey-200 rounded animate-pulse" />
                  <div className="h-6 w-4/6 bg-grey-200 rounded animate-pulse" />
                </motion.div>
              ))}
            </div>

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {[...Array(2)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-grey-50 rounded-xl p-6"
                >
                  <div className="h-6 w-32 bg-grey-200 rounded animate-pulse mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-grey-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-grey-200 rounded animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Events Skeleton */}
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
