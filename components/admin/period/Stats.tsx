import type { Period } from "@/types/period";
import { FiUsers, FiClock, FiCheckCircle, FiCalendar } from "react-icons/fi";

interface PeriodStatsProps {
  periods: Period[];
}

export default function PeriodStats({ periods }: PeriodStatsProps) {
  const activeCount = periods.filter((p) => p.isActive).length;
  const inactiveCount = periods.filter((p) => !p.isActive).length;

  // Hitung total rentang tahun dari semua period
  const totalYears = periods.reduce(
    (total, period) => total + (period.endYear - period.startYear + 1),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Total Period</h3>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiUsers className="text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {periods.length}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Aktif</h3>
          <div className="p-2 bg-green-100 rounded-lg">
            <FiCheckCircle className="text-green-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{activeCount}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Tidak Aktif</h3>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiClock className="text-yellow-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{inactiveCount}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Jumlah Tahun</h3>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiCalendar className="text-purple-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{totalYears}</p>
        <p className="text-xs text-gray-500 mt-1">Total rentang tahun</p>
      </div>
    </div>
  );
}
