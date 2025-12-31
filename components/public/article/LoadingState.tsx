import { Loader2, Newspaper } from "lucide-react";

export const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
          <Newspaper className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-grey-600 font-medium">Memuat artikel...</p>
      </div>
    </div>
  </div>
);
