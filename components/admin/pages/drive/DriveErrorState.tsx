"use client";

import React from "react";
import { XCircle, RefreshCw } from "lucide-react";
import type { DriveErrorStateProps } from "@/types/google-drive";

const DriveErrorState: React.FC<DriveErrorStateProps> = ({
  error,
  onRetry,
}) => {
  if (!error) return null;

  return (
    <div
      className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start"
      role="alert"
    >
      <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-medium">Error</h3>
        <p className="text-sm">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-auto text-sm underline hover:no-underline flex items-center gap-1"
      >
        <RefreshCw className="h-3 w-3" />
        Coba lagi
      </button>
    </div>
  );
};

export default DriveErrorState;
