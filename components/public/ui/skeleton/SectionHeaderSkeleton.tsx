export default function SectionHeaderSkeleton() {
  return (
    <div className="text-center mb-16">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse" />
        <div className="h-3 w-24 bg-primary-200 rounded animate-pulse" />
      </div>

      {/* Title */}
      <div className="space-y-3 mb-6">
        <div className="h-10 w-72 bg-grey-200 rounded-lg mx-auto animate-pulse" />
        <div className="h-10 w-64 bg-grey-200 rounded-lg mx-auto animate-pulse" />
      </div>

      {/* Description */}
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="h-5 w-full bg-grey-200 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-grey-200 rounded mx-auto animate-pulse" />
      </div>
    </div>
  );
}
