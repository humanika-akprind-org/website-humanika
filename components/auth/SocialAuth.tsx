"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authProviders } from "@/components/auth/providers";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface SocialAuthProps {
  isLoading?: boolean;
  callbackUrl?: string;
}

export function SocialAuth({
  isLoading = false,
  callbackUrl = "/dashboard",
}: SocialAuthProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "OAuthAccountNotLinked") {
      toast({
        title: "Account not linked",
        description:
          "Please sign in with the same provider you used originally",
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 gap-2">
      {authProviders.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => provider.signIn(callbackUrl)}
        >
          {isLoading ? (
            <span className="mr-2 h-4 w-4 animate-spin">↻</span>
          ) : (
            <provider.Icon className="mr-2 h-4 w-4" />
          )}
          Continue with {provider.name}
        </Button>
      ))}
    </div>
  );
}
