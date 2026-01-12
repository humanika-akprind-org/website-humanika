"use client";

import React from "react";
import type { BreadcrumbsProps } from "@/types/google-drive";

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  currentFolderId,
  onNavigate,
  isLoading = false,
}) => {
  // If no items and not in root, don't show breadcrumbs
  if (items.length === 0 && (!currentFolderId || currentFolderId === "root")) {
    return null;
  }

  return (
    <nav
      className="flex items-center space-x-2 text-sm mb-4 overflow-x-auto"
      aria-label="Breadcrumb"
    >
      {/* Home/My Drive button */}
      <button
        onClick={() => onNavigate("root")}
        disabled={isLoading || currentFolderId === "root"}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
          currentFolderId === "root"
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-current={currentFolderId === "root" ? "page" : undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>My Drive</span>
      </button>

      {/* Separator and path items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.id === currentFolderId;

        return (
          <React.Fragment key={item.id}>
            {/* Separator */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>

            {/* Breadcrumb item */}
            {isLast ? (
              <span
                className={`px-2 py-1 rounded font-medium whitespace-nowrap ${
                  isCurrent ? "bg-blue-100 text-blue-700" : "text-gray-500"
                }`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.name}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.id)}
                disabled={isLoading}
                className="px-2 py-1 rounded text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                {item.name}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
