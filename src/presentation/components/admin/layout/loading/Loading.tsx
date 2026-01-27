export default function Loading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse mt-4 md:mt-0" />
      </div>

      {/* UserStats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
        ))}
      </div>

      {/* UserFilters Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>

      {/* UserTable Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Skeleton */}
        <div className="p-4 border-t flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
