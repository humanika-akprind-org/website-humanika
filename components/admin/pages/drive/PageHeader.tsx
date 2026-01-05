import Link from "next/link";
import type { PageHeaderProps } from "@/types/google-drive";

export default function PageHeader({
  title,
  showAddButton = false,
  addButtonHref = "/admin/drive/add",
  addButtonText = "Tambah File",
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      {showAddButton && (
        <Link
          href={addButtonHref}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {addButtonText}
        </Link>
      )}
    </div>
  );
}
