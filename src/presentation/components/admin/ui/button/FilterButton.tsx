import { FiFilter, FiChevronDown } from "react-icons/fi";

interface FilterButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function FilterButton({ isOpen, onClick }: FilterButtonProps) {
  return (
    <button
      className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
      onClick={onClick}
    >
      <FiFilter className="mr-2 text-gray-500" />
      Filters
      <FiChevronDown
        className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}
