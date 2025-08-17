// components/auth/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";

interface LogoutButtonProps extends ButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout, ...props }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      onLogout?.();
      router.refresh();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button onClick={handleLogout} {...props}>
      Logout
    </Button>
  );
}
