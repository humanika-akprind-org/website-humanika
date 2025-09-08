"use client";

import React from "react";
import { FiUsers, FiCode, FiZap, FiShield } from "react-icons/fi";

interface ManagementStatsProps {
  departmentStats: {
    INFOKOM: number;
    PSDM: number;
    LITBANG: number;
    KWU: number;
  };
}

const ManagementStats: React.FC<ManagementStatsProps> = ({
  departmentStats,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-600">INFOKOM</h3>
        <div className="p-2 bg-blue-100 rounded-lg">
          <FiCode className="text-blue-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">
        {departmentStats.INFOKOM}
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-600">PSDM</h3>
        <div className="p-2 bg-green-100 rounded-lg">
          <FiUsers className="text-green-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">
        {departmentStats.PSDM}
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-600">LITBANG</h3>
        <div className="p-2 bg-yellow-100 rounded-lg">
          <FiZap className="text-yellow-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">
        {departmentStats.LITBANG}
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-600">KWU</h3>
        <div className="p-2 bg-purple-100 rounded-lg">
          <FiShield className="text-purple-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">
        {departmentStats.KWU}
      </p>
    </div>
  </div>
);

export default ManagementStats;
