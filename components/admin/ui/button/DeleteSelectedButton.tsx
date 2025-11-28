import { FiTrash2 } from "react-icons/fi";

interface DeleteSelectedButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export default function DeleteSelectedButton({
  selectedCount,
  onClick,
}: DeleteSelectedButtonProps) {
  return (
    <div className="flex items-end">
      <button
        className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
          selectedCount === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-red-50 text-red-700 hover:bg-red-100"
        }`}
        onClick={onClick}
        disabled={selectedCount === 0}
      >
        <FiTrash2 className="mr-2" />
        Delete Selected ({selectedCount})
      </button>
    </div>
  );
}
