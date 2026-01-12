import { motion } from "framer-motion";
import SectionHeaderSkeleton from "@/components/public/ui/skeleton/SectionHeaderSkeleton";
import GalleryGridSkeleton from "@/components/public/ui/skeleton/GalleryGridSkeleton";

export default function GalleryPageLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <SectionHeaderSkeleton />

          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="h-14 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-10">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
              >
                <div className="h-10 w-20 bg-primary-800/50 rounded-lg mx-auto mb-2 animate-pulse" />
                <div className="h-4 w-24 bg-primary-700/30 rounded mx-auto animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Skeleton */}
        <div className="flex justify-center gap-4 mb-10">
          {[...Array(2)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-12 w-32 bg-grey-200 rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* Control Bar Skeleton */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            <div className="flex flex-wrap gap-4">
              {/* Year Filter */}
              <div className="h-10 w-32 bg-grey-200 rounded-lg animate-pulse" />
              {/* Event Filter */}
              <div className="h-10 w-48 bg-grey-200 rounded-lg animate-pulse" />
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="h-10 w-32 bg-grey-200 rounded-lg animate-pulse" />
              {/* View Mode */}
              <div className="flex items-center bg-grey-100 rounded-lg p-1">
                <div className="w-10 h-10 bg-white rounded-md shadow animate-pulse" />
                <div className="w-10 h-10 rounded-md animate-pulse" />
              </div>
              {/* Refresh */}
              <div className="h-10 w-10 bg-grey-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <GalleryGridSkeleton />

        {/* Load More Skeleton */}
        <div className="mt-12 text-center">
          <div className="h-14 w-48 bg-grey-200 rounded-xl mx-auto animate-pulse" />
        </div>

        {/* Top Events Section Skeleton */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="h-7 w-40 bg-grey-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="h-32 bg-grey-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-5 w-3/4 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-1/2 bg-grey-100 rounded animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
