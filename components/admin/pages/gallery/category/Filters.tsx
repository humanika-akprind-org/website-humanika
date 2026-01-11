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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Search */}
        <SearchInput
          placeholder="Search categories..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        {/* Bulk Actions */}
        <DeleteSelectedButton
          selectedCount={selectedCategories.length}
          onClick={onDeleteSelected}
        />
      </div>
    </div>
  );
}
