import { motion } from "framer-motion";

export default function GalleryDetailLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-4 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
          </div>

          {/* Title */}
          <div className="max-w-4xl mx-auto text-center mb-6">
            <div className="h-10 w-3/4 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="h-10 w-1/2 bg-white/20 rounded-lg mx-auto mt-4 animate-pulse" />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-5 w-28 bg-white/20 rounded animate-pulse" />
            <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Thumbnail Preview */}
          <div className="mb-8">
            <div className="h-[400px] bg-grey-200 rounded-2xl animate-pulse" />
          </div>

          {/* Description */}
          <div className="mb-12">
            <div className="h-6 w-full bg-grey-200 rounded animate-pulse" />
            <div className="h-6 w-5/6 bg-grey-200 rounded mt-3 animate-pulse" />
            <div className="h-6 w-4/6 bg-grey-200 rounded mt-3 animate-pulse" />
          </div>

          {/* Photo Grid Skeleton */}
          <div className="mb-12">
            <div className="h-7 w-40 bg-grey-200 rounded animate-pulse mb-6" />
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
          </div>

          {/* Related Albums Skeleton */}
          <div>
            <div className="h-7 w-40 bg-grey-200 rounded animate-pulse mb-6" />
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
                    <div className="h-6 w-full bg-grey-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-grey-100 rounded animate-pulse" />
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
