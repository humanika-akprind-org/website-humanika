"use client";

import { FiX } from "react-icons/fi";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  structure: string;
  title?: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  structure,
  title = "Structure Preview",
}: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          {structure ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: structure.replace(/\n/g, "<br />"),
              }}
            />
          ) : (
            <div className="text-gray-500 text-center py-8">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>No structure content to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
