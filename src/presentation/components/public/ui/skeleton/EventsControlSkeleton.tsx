export default function EventsControlSkeleton() {
  return (
    <div className="mb-10">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-grey-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-grey-100 rounded animate-pulse" />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-20 bg-grey-200 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-grey-100 rounded-lg p-1">
          <div className="w-10 h-10 bg-white rounded-md shadow animate-pulse" />
          <div className="w-10 h-10 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
