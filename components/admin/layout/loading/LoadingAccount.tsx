export default function LoadingAccount() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </div>

      {/* Change Password Section Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse mb-6" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>

      {/* Delete Account Section Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-6" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-4" />
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
    </div>
  );
}
