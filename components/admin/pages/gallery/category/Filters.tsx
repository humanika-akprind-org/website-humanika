import SearchInput from "../../../ui/input/SearchInput";
import DeleteSelectedButton from "../../../ui/button/DeleteSelectedButton";

interface GalleryCategoryFiltersProps {
  searchTerm: string;
  selectedCategories: string[];
  onSearchChange: (value: string) => void;
  onDeleteSelected: () => void;
}

export default function GalleryCategoryFilters({
  searchTerm,
  selectedCategories,
  onSearchChange,
  onDeleteSelected,
}: GalleryCategoryFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search categories..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <DeleteSelectedButton
            selectedCount={selectedCategories.length}
            onClick={onDeleteSelected}
          />
        )}
      </div>
    </div>
  );
}
