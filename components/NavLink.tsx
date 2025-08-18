"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
} & ComponentProps<typeof Link>;

export function NavLink({
  href,
  children,
  exact = false,
  className = "",
  activeClassName = "",
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname?.startsWith(href) ||
      (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={clsx(
        "px-4 py-2 font-medium transition-colors duration-200",
        "flex items-center border-b-2 border-transparent",
        "hover:bg-blue-700 hover:border-yellow-400",
        "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50",
        isActive
          ? clsx("bg-blue-700 border-yellow-400", activeClassName)
          : className
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
