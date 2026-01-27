"use client";

import React from "react";
import type { DriveLoadingStateProps } from "@/types/google-drive";

const DriveLoadingState: React.FC<DriveLoadingStateProps> = ({
  count = 10,
}) => (
  <div className="p-8">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse bg-gray-100 rounded-lg p-4">
          <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-3" />
          <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

export default DriveLoadingState;
