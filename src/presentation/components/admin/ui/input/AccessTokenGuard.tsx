"use client";

import React, { useState, useEffect } from "react";
import GoogleDriveConnect from "@/presentation/components/admin/google-drive/GoogleDriveConnect";
import {
  getAccessTokenAction,
  validateAccessToken,
  refreshAccessTokenAction,
} from "@/presentation/lib/actions/accessToken";

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
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenAction();

        // If no token exists, show connect button
        if (!token) {
          setAccessToken(null);
          setIsLoadingToken(false);
          return;
        }

        // Try to validate token by checking user info
        // If it fails, token is expired
        try {
          const isValid = await validateAccessToken(token);
          if (isValid) {
            setAccessToken(token);
          } else {
            // Token expired, try to refresh
            const newToken = await refreshAccessTokenAction();
            if (newToken) {
              setAccessToken(newToken);
            } else {
              setAccessToken(null);
              setTokenError(true);
            }
          }
        } catch {
          // Token validation failed, try refresh
          const newToken = await refreshAccessTokenAction();
          if (newToken) {
            setAccessToken(newToken);
          } else {
            setAccessToken(null);
            setTokenError(true);
          }
        }
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

  // Jika tidak ada accessToken atau token error (expired), tampilkan GoogleDriveConnect
  if (!accessToken || tokenError) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <GoogleDriveConnect />
          <p className="text-sm text-gray-500 mt-2">
            {tokenError
              ? "Sesi Google Drive Anda telah habis. Silakan hubungkan kembali."
              : noTokenMessage}
          </p>
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
