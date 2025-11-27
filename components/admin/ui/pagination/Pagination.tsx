import React from "react";

interface PaginationProps {
  usersLength: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  usersLength,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
      <p className="text-sm text-gray-700 mb-4 sm:mb-0">
        Showing <span className="font-medium">{usersLength}</span> users
      </p>
      <div className="flex items-center space-x-1">
        <button
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {(() => {
          const pages = [];
          const delta = 2; // Number of pages to show on each side of current page

          // Always show first page
          if (1 < currentPage - delta) {
            pages.push(
              <button
                key={1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
            );
            if (2 < currentPage - delta) {
              pages.push(
                <span key="start-ellipsis" className="px-2 text-gray-500">
                  ...
                </span>
              );
            }
          }

          // Show pages around current page
          for (
            let i = Math.max(1, currentPage - delta);
            i <= Math.min(totalPages, currentPage + delta);
            i++
          ) {
            pages.push(
              <button
                key={i}
                className={`px-3 py-1.5 text-sm border rounded-md ${
                  i === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onPageChange(i)}
              >
                {i}
              </button>
            );
          }

          // Always show last page
          if (totalPages > currentPage + delta) {
            if (totalPages - 1 > currentPage + delta) {
              pages.push(
                <span key="end-ellipsis" className="px-2 text-gray-500">
                  ...
                </span>
              );
            }
            pages.push(
              <button
                key={totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            );
          }

          return pages;
        })()}

        <button
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
