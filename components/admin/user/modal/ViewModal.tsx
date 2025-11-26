import { FiX } from "react-icons/fi";
import type { User } from "@/types/user";
import Avatar from "../../ui/avatar/Avatar";
import Role from "../../ui/chip/user/Role";
import PositionChip from "../../ui/chip/user/Position";
import DepartmentChip from "../../ui/chip/user/Department";
import ActiveChip from "../../ui/chip/user/Active";
import DateDisplay from "../../ui/date/DateDisplay";

interface ViewUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export default function ViewUserModal({
  isOpen,
  user,
  onClose,
}: ViewUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              User Details
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
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar user={user} size="lg" />
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h4>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <Role role={user.role} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  {user.department ? (
                    <DepartmentChip department={user.department} />
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <div className="mt-1">
                  {user.position ? (
                    <PositionChip position={user.position} />
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <ActiveChip isActive={user.isActive} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Verified
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.verifiedAccount ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Login Attempts
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.attemptLogin}
                </p>
              </div>

              {user.blockExpires && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Block Expires
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    <DateDisplay date={user.blockExpires} />
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={user.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={user.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
