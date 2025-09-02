// components/admin/NavLink.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function NavLink({
  href,
  icon: Icon,
  children,
  className = "",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm ml-3 group ${
        isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
      } ${className}`}
    >
      <Icon
        className={`h-4 w-4 group-hover:text-blue-600 ${
          isActive ? "text-blue-600" : ""
        }`}
      />
      <span>{children}</span>
    </Link>
  );
}
