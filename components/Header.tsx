import Link from "next/link";
import { NavLink } from "./NavLink";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">HUMANIKA</h1>
              <p className="text-blue-200 text-sm">
                Himpunan Mahasiswa Informatika
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-md hover:bg-yellow-300 transition-colors flex items-center gap-2 font-medium shadow-md"
            >
              Login
            </Link>
          </div>
        </div>

        <nav className="flex justify-center border-t border-blue-700">
          <ul className="flex space-x-1">
            <li>
              <NavLink href="/" exact>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink href="/about" exact>
                About
              </NavLink>
            </li>
            <li>
              <NavLink href="/event" exact>
                Event
              </NavLink>
            </li>
            <li>
              <NavLink href="/article" exact>
                Article
              </NavLink>
            </li>
            <li>
              <NavLink href="/gallery" exact>
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink href="/contact" exact>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
