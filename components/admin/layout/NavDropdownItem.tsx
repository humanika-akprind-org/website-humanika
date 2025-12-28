// components/admin/NavDropdownItem.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavDropdownItemProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function NavDropdownItem({
  href,
  children,
  onClick,
}: NavDropdownItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs ml-3 ${
        isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
      }`}
    >
      <span>{children}</span>
    </Link>
  );
}
