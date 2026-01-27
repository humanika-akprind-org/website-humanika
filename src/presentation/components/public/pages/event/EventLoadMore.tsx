import { Loader2, ChevronDown } from "lucide-react";

interface EventLoadMoreProps {
  onLoadMore: () => void;
  loading: boolean;
}

export default function EventLoadMore({
  onLoadMore,
  loading,
}: EventLoadMoreProps) {
  return (
    <div className="mt-12 text-center">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Memuat...
          </>
        ) : (
          <>
            <span>Muat Lebih Banyak</span>
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
}
