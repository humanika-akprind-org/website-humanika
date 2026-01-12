"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GoogleDriveStatusProps {
  accessToken: string;
}

export default function GoogleDriveStatus({
  accessToken,
}: GoogleDriveStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/google-drive/auth");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      setIsLoading(false);
    }
  };

  // If already connected, show checklist
  if (accessToken) {
    return (
      <div className="inline-flex items-center gap-2 text-green-600 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" />
        Drive Connected
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
      Connect Drive
    </Button>
  );
}
