export default function LoadingActivity() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="animate-pulse">
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b">
            <div className="grid grid-cols-6 gap-4 p-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Table Body Rows */}
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div className="grid grid-cols-6 gap-4 p-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-4 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-8 w-8 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
