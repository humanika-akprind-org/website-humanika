"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface UploadProgressModalProps {
  isOpen: boolean;
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  fileName,
  progress,
  status,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => {}}
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          {status === "uploading" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="w-full h-full border-4 border-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Mengunggah {fileName}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{progress}% selesai</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Berhasil Diunggah
              </p>
              <p className="text-sm text-gray-500">{fileName}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Gagal Mengunggah
              </p>
              <p className="text-sm text-gray-500 mb-2">{error || fileName}</p>
              <p className="text-sm text-red-500">Silakan coba lagi</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProgressModal;
