"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/auth/admin/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-red-500 hover:bg-red-50 w-full justify-start"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
