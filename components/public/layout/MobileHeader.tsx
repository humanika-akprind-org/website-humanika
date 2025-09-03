"use client";

import Link from "next/link";
import { NavLink } from "./NavLink";
import Image from "next/image";
import { LogoutButton } from "@/components/public/LogoutButton";
import { useState } from "react";

interface User {
  name: string;
  role: string;
}

interface MobileHeaderClientProps {
  currentUser: User | null;
}

export function MobileHeaderClient({ currentUser }: MobileHeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-full shadow-md">
            <Image
              src="https://drive.google.com/uc?export=view&id=1gb5FoF_-uUJ6LnVH6ZJr2OAdwbZxl-tg"
              alt="HUMANIKA Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">HUMANIKA</h1>
            <h6 className="text-blue-200 font-semibold text-sm">
              Himpunan Mahasiswa Informatika
            </h6>
            <p className="text-blue-200 text-xs">
              Universitas AKPRIND Indonesia
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentUser ? (
            // Tampilkan informasi user dan tombol Logout jika user sudah login (versi ringkas)
            <div className="flex items-center space-x-2">
              <div className="hidden xs:flex items-center space-x-2 bg-blue-700/30 py-1 px-3 rounded-full border border-blue-500/50">
                <div className="text-right max-w-[100px]">
                  <p
                    className="font-medium text-sm truncate"
                    title={currentUser.name}
                  >
                    {currentUser.name}
                  </p>
                  <p className="text-blue-200 text-xs bg-blue-900/40 px-1 py-0.5 rounded-full mt-0.5 inline-block">
                    {currentUser.role}
                  </p>
                </div>
                {/* <div className="h-6 w-px bg-blue-500/50" />
                <LogoutButton/> */}
              </div>

              {/* Versi sangat ringkas untuk layar sangat kecil
              <div className="xs:hidden flex items-center">
                <LogoutButton />
              </div> */}
            </div>
          ) : null}

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="border-t border-blue-700 pb-3">
          {/* Tampilkan info user di dalam menu hamburger jika sudah login */}
          {currentUser && (
            <div className="pt-3 pb-2 px-2 bg-blue-700/20 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="font-medium text-sm truncate"
                    title={currentUser.name}
                  >
                    {currentUser.name}
                  </p>
                  <p className="text-blue-200 text-xs bg-blue-900/40 px-2 py-1 rounded-full mt-1 inline-block">
                    {currentUser.role}
                  </p>
                </div>
                <LogoutButton />
              </div>
            </div>
          )}

          <ul className="grid grid-cols-2 gap-2 mt-2">
            <li>
              <NavLink href="/" exact onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink href="/about" exact onClick={() => setIsMenuOpen(false)}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink href="/event" exact onClick={() => setIsMenuOpen(false)}>
                Event
              </NavLink>
            </li>
            <li>
              <NavLink
                href="/article"
                exact
                onClick={() => setIsMenuOpen(false)}
              >
                Article
              </NavLink>
            </li>
            <li>
              <NavLink
                href="/gallery"
                exact
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                href="/contact"
                exact
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>

            {/* Tampilkan tombol login/daftar di menu hamburger jika belum login */}
            {!currentUser && (
              <>
                <li className="col-span-2 border-t border-blue-700 pt-2 mt-2">
                  <Link
                    href="/auth/register"
                    className="block text-center px-4 py-2 bg-transparent border border-yellow-500 text-white rounded-full hover:border-white hover:bg-white hover:text-blue-800 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </li>
                <li className="col-span-2">
                  <Link
                    href="/auth/login"
                    className="block text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-300 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
