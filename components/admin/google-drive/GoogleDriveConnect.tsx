"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GoogleDriveConnect() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Move the auth logic to API route
      const response = await fetch("/api/google-drive/auth");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Google Drive"
        )}
      </Button>
      <p className="text-sm text-muted-foreground">
        You&apos;ll be redirected to Google to authorize access
      </p>
    </div>
  );
}
