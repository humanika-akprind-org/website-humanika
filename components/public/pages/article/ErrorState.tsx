import { RefreshCw, BarChart3 } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center py-16 px-4">
      <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <BarChart3 className="w-12 h-12 text-red-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-grey-900 mb-2">
            Gagal Memuat Artikel
          </h3>
          <p className="text-grey-600 mb-6">{error}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/article"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-grey-100 text-grey-700 rounded-xl hover:bg-grey-200 transition-colors font-medium"
          >
            Kembali ke Artikel
          </Link>
        </div>
      </div>
    </div>
  </div>
);
