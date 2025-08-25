import Link from "next/link";
import { NavLink } from "./NavLink";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full shadow-md">
              <Image
                src="https://drive.google.com/uc?export=view&id=1gb5FoF_-uUJ6LnVH6ZJr2OAdwbZxl-tg"
                alt="HUMANIKA Logo"
                width={75}
                height={75}
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HUMANIKA</h1>
              <h6 className="text-blue-200 font-semibold text-md">
                Himpunan Mahasiswa Informatika
              </h6>
              <p className="text-blue-200 text-sm">
                Universitas AKPRIND Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/auth/register"
              className="px-5 py-2.5 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-800 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              Daftar
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-yellow-400 text-blue-900 rounded-full hover:bg-yellow-300 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              Masuk
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
