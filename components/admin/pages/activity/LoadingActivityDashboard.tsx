export default function LoadingActivityDashboard() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="animate-pulse py-1">
          <div className="h-8 bg-gray-300 rounded w-48" />
        </div>
        <div className="animate-pulse flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 py-1">
          <div className="h-10 bg-gray-300 rounded w-40" />
          <div className="h-10 bg-gray-300 rounded w-32" />
        </div>
      </div>

      {/* Service Filters Skeleton */}
      <div className="mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-32 mb-3" />
        </div>
        <div className="animate-pulse flex flex-wrap gap-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-300 rounded-full w-20" />
          ))}
        </div>
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-24" />
              <div className="p-2 bg-gray-300 rounded-lg">
                <div className="h-4 w-4 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-16 mt-2" />
          </div>
        ))}
      </div>

      {/* Activity Log Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="h-6 bg-gray-300 rounded w-40" />
          <div className="h-4 bg-gray-300 rounded w-24" />
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse p-6 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full" />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-300 rounded w-64" />
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="animate-pulse p-4 border-t border-gray-200 bg-gray-50 text-center">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
