"use client";

import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import type { DriveToastProps } from "@/types/google-drive";

const DriveToast: React.FC<DriveToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 ${
        toast.type === "success"
          ? "bg-green-500 text-white"
          : toast.type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
      }`}
      role="alert"
    >
      {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
      {toast.type === "error" && <XCircle className="w-5 h-5" />}
      {toast.type === "info" && <Info className="w-5 h-5" />}
      <span className="font-medium">{toast.message}</span>
    </div>
  );
};

export default DriveToast;
