import { Newspaper, X } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export const EmptyState = ({ hasFilters, onResetFilters }: EmptyStateProps) => (
  <div className="text-center py-20">
    <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
        <Newspaper className="w-12 h-12 text-primary-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-grey-900 mb-2">
          Tidak Ada Artikel Ditemukan
        </h3>
        <p className="text-grey-600 mb-8">
          {hasFilters
            ? "Coba ubah filter atau kata kunci pencarian Anda."
            : "Belum ada artikel yang tersedia saat ini."}
        </p>
      </div>
      {hasFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <X className="w-4 h-4" />
          Reset Filter
        </button>
      )}
    </div>
  </div>
);
