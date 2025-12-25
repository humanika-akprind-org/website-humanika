import { FiX, FiExternalLink } from "react-icons/fi";

interface WarningModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onRedirect: () => void;
  redirectText: string;
}

export default function WarningModal({
  isOpen,
  title,
  message,
  onClose,
  onRedirect,
  redirectText,
}: WarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            onClick={onRedirect}
          >
            <FiExternalLink size={16} />
            <span>{redirectText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
