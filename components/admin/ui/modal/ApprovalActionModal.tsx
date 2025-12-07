import { useState } from "react";
import { FiX } from "react-icons/fi";
import TextEditor from "../text-area/TextEditor";

interface ApprovalActionModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (note: string) => void;
  loading?: boolean;
}

export default function ApprovalActionModal({
  isOpen,
  title,
  onClose,
  onConfirm,
  loading = false,
}: ApprovalActionModalProps) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(note);
    setNote("");
    onClose();
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <TextEditor value={note} onChange={setNote} disabled={loading} />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
