import { RefreshCw, BarChart3 } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="text-center py-16">
    <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <BarChart3 className="w-10 h-10 text-red-500" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-grey-900 mb-2">
          Gagal Memuat Artikel
        </h3>
        <p className="text-grey-600 mb-6">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </button>
    </div>
  </div>
);
