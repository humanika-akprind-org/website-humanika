"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
    >
      <LogOut className="h-4 w-4" />
      Keluar
    </Button>
  );
}
