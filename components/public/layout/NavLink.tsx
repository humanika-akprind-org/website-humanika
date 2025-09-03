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

  // Fungsi untuk menentukan status aktif yang lebih robust
  const getIsActive = (): boolean => {
    if (!pathname) return false;

    if (exact) {
      return pathname === href;
    }

    // Handle kasus khusus untuk homepage
    if (href === "/") {
      return pathname === "/";
    }

    // Cek apakah pathname dimulai dengan href dan diikuti oleh slash atau akhir string
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (pathname.startsWith(href) && pathname.length === href.length)
    );
  };

  const isActive = getIsActive();

  // Class dasar yang selalu diterapkan
  const baseClasses = clsx(
    "px-4 py-2 font-medium transition-colors duration-200",
    "flex items-center border-b-2 border-transparent",
    "hover:bg-blue-700 hover:border-yellow-400",
    "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  // Class kondisional berdasarkan status aktif
  const stateClasses = clsx(
    isActive
      ? clsx("bg-blue-700 border-yellow-400", activeClassName)
      : clsx(inactiveClassName, className)
  );

  return (
    <Link
      href={href}
      className={clsx(baseClasses, stateClasses)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
