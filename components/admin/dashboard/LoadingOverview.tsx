export default function LoadingOverview() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-300 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-300 rounded" />
          <div className="h-64 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
