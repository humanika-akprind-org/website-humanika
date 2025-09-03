import { FiX } from "react-icons/fi";
import type { User } from "../../../../types/user";

interface PasswordResetModalProps {
  isOpen: boolean;
  user: User | null;
  newPassword: string;
  confirmPassword: string;
  forceReset: boolean;
  onClose: () => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onForceResetChange: (force: boolean) => void;
  onConfirm: () => void;
}

export default function PasswordResetModal({
  isOpen,
  user,
  newPassword,
  confirmPassword,
  forceReset,
  onClose,
  onPasswordChange,
  onConfirmPasswordChange,
  onForceResetChange,
  onConfirm,
}: PasswordResetModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Reset Password
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
          <p className="text-gray-600 mb-4">
            Reset password for <span className="font-medium">{user.name}</span>
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="forceReset"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                checked={forceReset}
                onChange={(e) => onForceResetChange(e.target.checked)}
              />
              <label
                htmlFor="forceReset"
                className="ml-2 text-sm text-gray-700"
              >
                Require password change at next login
              </label>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={onConfirm}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
