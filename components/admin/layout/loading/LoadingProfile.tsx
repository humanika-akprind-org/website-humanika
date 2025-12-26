export default function LoadingProfile() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-32" />
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-28" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-40 mt-2" />
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-32" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-40" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-28" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-12 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-20" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-24" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-22" />
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-18" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
