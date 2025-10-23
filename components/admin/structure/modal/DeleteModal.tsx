"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  structureName: string;
  count?: number;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  structureName,
  count = 1,
  isLoading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Hapus Struktur Organisasi
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Apakah Anda yakin ingin menghapus{" "}
            <span className="font-medium text-gray-900">
              {count > 1
                ? `${count} struktur organisasi`
                : `"${structureName}"`}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
