// components/admin/NavDropdown.tsx
'use client';

import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface NavDropdownProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export default function NavDropdown({
  icon: Icon,
  title,
  children,
}: NavDropdownProps) {
  return (
    <details className="group">
      <summary className="flex items-center justify-between p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer list-none">
        <div className="flex items-center space-x-3">
          <Icon className="h-4 w-4" />
          <span className="text-sm">{title}</span>
        </div>
        <ChevronDown className="h-4 w-4 transform group-open:rotate-180 transition-transform text-gray-400" />
      </summary>
      <div className="ml-6 mt-1 space-y-1">{children}</div>
    </details>
  );
}
