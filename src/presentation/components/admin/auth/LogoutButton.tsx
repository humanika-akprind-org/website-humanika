"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { LogOut } from "lucide-react";
import { AuthApi } from "@/presentation/services/auth";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await AuthApi.logout();
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
