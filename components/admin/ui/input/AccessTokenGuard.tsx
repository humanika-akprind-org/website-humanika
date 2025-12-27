"use client";

import React, { useState, useEffect } from "react";
import GoogleDriveConnect from "@/components/admin/google-drive/GoogleDriveConnect";
import { getAccessTokenAction } from "@/lib/actions/accessToken";

interface AccessTokenGuardProps {
  label: string;
  required?: boolean;
  loadingMessage?: string;
  noTokenMessage?: string;
  children: React.ReactNode;
}

export default function AccessTokenGuard({
  label,
  required = false,
  loadingMessage = "Memeriksa koneksi Google Drive...",
  noTokenMessage = "Anda perlu terhubung ke Google Drive terlebih dahulu untuk mengupload",
  children,
}: AccessTokenGuardProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenAction();
        setAccessToken(token);
      } catch (error) {
        console.error("Failed to fetch access token:", error);
        setAccessToken(null);
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchAccessToken();
  }, []);

  // Loading state while fetching token
  if (isLoadingToken) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
          <p className="text-sm text-gray-500 mt-2">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada accessToken, tampilkan GoogleDriveConnect
  if (!accessToken) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <GoogleDriveConnect />
          <p className="text-sm text-gray-500 mt-2">{noTokenMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      {children}
    </>
  );
}
