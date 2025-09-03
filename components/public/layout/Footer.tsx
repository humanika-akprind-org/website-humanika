import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Konten utama footer */}
      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              HUMANIKA
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Himpunan Mahasiswa Informatika yang berdedikasi untuk
              mengembangkan potensi mahasiswa di bidang teknologi informasi.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Menu
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/article"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Article
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Members
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2 group-hover:w-2 group-hover:h-2 transition-all"/>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Sosial Media
            </h3>
            <div className="flex space-x-3 mb-6">
              {[
                {
                  name: "Facebook",
                  icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                  color: "bg-blue-600 hover:bg-blue-700",
                },
                {
                  name: "Instagram",
                  icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
                  color:
                    "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                },
                {
                  name: "Twitter",
                  icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                  color: "bg-blue-400 hover:bg-blue-500",
                },
                {
                  name: "YouTube",
                  icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                  color: "bg-red-600 hover:bg-red-700",
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`${social.color} text-white p-3 rounded-lg transition-all transform hover:-translate-y-1`}
                  aria-label={social.name}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-gray-400 mb-3 text-sm">
              Subscribe untuk newsletter kami
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Anda"
                className="px-4 py-3 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-r-md hover:from-blue-700 hover:to-indigo-800 transition-all font-medium flex items-center">
                Subscribe
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} HIMPUNAN MAHASISWA INFORMATIKA
            (HUMANIKA). All rights reserved.
          </p>
        </div>
      </div>

      {/* HUMANIKA besar di bagian bawah yang terpotong */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="text-[180px] lg:text-[240px] font-black tracking-wide text-gray-800 opacity-50 text-center -mb-16 lg:-mb-20 leading-none">
          HUMANIKA
        </div>
      </div>
    </footer>
  );
}
