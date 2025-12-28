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
  inactiveClassName?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

export function NavLink({
  href,
  children,
  exact = false,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  ...props
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = !pathname
    ? false
    : exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  const combinedClasses = clsx(
    "px-4 py-2 font-medium transition-colors duration-200",
    "flex items-center border-b-2 border-transparent",
    "hover:bg-blue-700 rounded-md",
    "focus:outline-none focus:ring-2 focus:ring-opacity-50",
    className,
    isActive
      ? clsx("bg-blue-700 rounded-md", activeClassName)
      : inactiveClassName
  );

  return (
    <Link
      href={href}
      className={combinedClasses}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
