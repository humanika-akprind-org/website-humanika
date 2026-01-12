import { motion } from "framer-motion";
import SectionHeaderSkeleton from "@/components/public/ui/skeleton/SectionHeaderSkeleton";
import StatsSkeleton from "@/components/public/ui/skeleton/StatsSkeleton";
import CategoryPillsSkeleton from "@/components/public/ui/skeleton/CategoryPillsSkeleton";
import CardSkeleton from "@/components/public/ui/skeleton/CardSkeleton";

export default function EventPageLoadingState() {
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
          <div className="mt-10">
            <StatsSkeleton />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Skeleton */}
        <div className="flex justify-center gap-4 mb-10">
          {[...Array(3)].map((_, index) => (
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-grey-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-grey-100 rounded animate-pulse" />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-24 bg-grey-200 rounded-lg animate-pulse"
                />
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-grey-200 rounded-lg animate-pulse" />
              <div className="flex items-center bg-grey-100 rounded-lg p-1">
                <div className="w-10 h-10 bg-white rounded-md shadow animate-pulse" />
                <div className="w-10 h-10 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-grey-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-grey-100 rounded animate-pulse" />
          </div>
          <div className="h-4 w-24 bg-grey-100 rounded animate-pulse" />
        </div>

        {/* Event Grid Skeleton */}
        <CardSkeleton
          count={6}
          gridClass="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        />

        {/* Load More Skeleton */}
        <div className="mt-12 text-center">
          <div className="h-14 w-48 bg-grey-200 rounded-xl mx-auto animate-pulse" />
        </div>

        {/* Popular Categories Skeleton */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="h-7 w-40 bg-grey-200 rounded mx-auto animate-pulse" />
          </div>
          <CategoryPillsSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}
