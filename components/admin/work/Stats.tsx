import { FiTrendingUp, FiDollarSign } from "react-icons/fi";
import type { WorkProgram } from "@/types/work";

interface WorkStatsProps {
  workPrograms: WorkProgram[];
}

export default function WorkStats({ workPrograms }: WorkStatsProps) {
  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">
            Total Programs
          </h3>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiTrendingUp className="text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {workPrograms.length}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
          <div className="p-2 bg-green-100 rounded-lg">
            <FiDollarSign className="text-green-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {formatCurrency(
            workPrograms.reduce((sum, program) => sum + program.funds, 0)
          )}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Used Funds</h3>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiDollarSign className="text-yellow-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {formatCurrency(
            workPrograms.reduce((sum, program) => sum + program.usedFunds, 0)
          )}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">
            Remaining Funds
          </h3>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiDollarSign className="text-purple-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {formatCurrency(
            workPrograms.reduce(
              (sum, program) => sum + program.remainingFunds,
              0
            )
          )}
        </p>
      </div>
    </div>
  );
}
