import SectionHeaderSkeleton from "@/components/public/ui/skeleton/SectionHeaderSkeleton";
import StatsSkeleton from "@/components/public/ui/skeleton/StatsSkeleton";
import CategoryPillsSkeleton from "@/components/public/ui/skeleton/CategoryPillsSkeleton";
import CardSkeleton from "@/components/public/ui/skeleton/CardSkeleton";

export default function ArchivePageLoadingState() {
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
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-grey-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-grey-100 rounded animate-pulse mt-2" />
        </div>

        {/* Control Bar Skeleton */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
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
