"use client";

import { ChevronDown, Cloudy, CloudOff } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  getGoogleDriveAuthUrl,
  logoutGoogleDrive,
} from "@/presentation/services/google-drive";

interface GoogleDriveStatusProps {
  accessToken: string;
  userEmail: string;
}

export default function GoogleDriveStatus({
  accessToken,
  userEmail,
}: GoogleDriveStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { url } = await getGoogleDriveAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutGoogleDrive();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If already connected, show checklist with dropdown
  if (accessToken) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-3 text-green-600 text-sm font-medium hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors h-[34px]"
        >
          <Cloudy className="h-4 w-4" />
          {userEmail}
          <ChevronDown className="h-4 w-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {isLoading ? "Loading..." : "Switch Account"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <CloudOff className="h-4 w-4" /> Connect Drive
    </Button>
  );
}
