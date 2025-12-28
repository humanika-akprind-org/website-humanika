export default function LoadingStats() {
  return (
    <div>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gray-300 rounded-xl mr-4 h-12 w-12" />
          <div>
            <div className="h-8 bg-gray-300 rounded mb-1 w-48" />
            <div className="h-4 bg-gray-300 rounded w-32" />
          </div>
        </div>

        {/* Finance Section: 3 MetricCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-lg h-32" />
          ))}
        </div>

        {/* Finance Chart */}
        <div className="bg-gray-300 rounded-xl h-80 mb-8" />

        {/* Organization Stats Section: 4 MetricCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-lg h-32" />
          ))}
        </div>

        {/* Content & Events Section: 4 MetricCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-lg h-32" />
          ))}
        </div>

        {/* Charts Section: 2 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-300 rounded-xl h-72" />
          <div className="bg-gray-300 rounded-xl h-72" />
        </div>
      </div>
    </div>
  );
}
