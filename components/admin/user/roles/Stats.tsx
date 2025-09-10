import { FiUserX, FiUser, FiRefreshCw } from "react-icons/fi";

interface StatsProps {
  unverifiedUsersCount: number;
  selectedUsersCount: number;
  processingCount: number;
}

export default function Stats({
  unverifiedUsersCount,
  selectedUsersCount,
  processingCount,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">
            Unverified Users
          </h3>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiUserX className="text-yellow-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {unverifiedUsersCount}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">
            Selected Users
          </h3>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiUser className="text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {selectedUsersCount}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiRefreshCw className="text-purple-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {processingCount}
        </p>
      </div>
    </div>
  );
}
