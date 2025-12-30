import { Calendar, X } from "lucide-react";
import type { EventTab } from "@/hooks/event/useEventPage";

interface EventEmptyStateProps {
  activeTab: EventTab;
  searchQuery: string;
  selectedCategory: string;
  selectedType: string;
  selectedStatus: string;
  onResetFilters: () => void;
}

export default function EventEmptyState({
  activeTab,
  searchQuery,
  selectedCategory,
  selectedType,
  selectedStatus,
  onResetFilters,
}: EventEmptyStateProps) {
  const hasFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedType !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="text-center py-20">
      <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-grey-900 mb-2">
            Tidak Ada Event Ditemukan
          </h3>
          <p className="text-grey-600 mb-8">
            {hasFilters
              ? "Coba ubah filter atau kata kunci pencarian Anda."
              : activeTab === "upcoming"
              ? "Belum ada event mendatang. Silakan kembali lagi nanti."
              : "Belum ada event terdahulu yang tercatat."}
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
}
