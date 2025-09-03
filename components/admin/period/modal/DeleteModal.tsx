import { FiX } from "react-icons/fi";
import type { Period } from "@/types/period";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  period?: Period | null;
  selectedCount: number;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  period,
  selectedCount,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Konfirmasi Penghapusan
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">
            {period
              ? `Apakah Anda yakin ingin menghapus period "${period.name}"? Tindakan ini tidak dapat dibatalkan.`
              : `Apakah Anda yakin ingin menghapus ${selectedCount} period terpilih? Tindakan ini tidak dapat dibatalkan.`}
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
