import ContactForm from "@/components/public/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Punya pertanyaan atau ingin berkolaborasi? Silakan hubungi tim
              HUMANIKA melalui form berikut.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Informasi Kontak</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 z-0 opacity-30" />
            </h2>
            <p className="text-gray-700 mb-8">
              Kami senang mendengar dari Anda! Tim HUMANIKA akan merespons
              pertanyaan Anda secepat mungkin.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Telepon
                  </h3>
                  <p className="text-gray-600">+62 123 4567 890</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Senin-Jumat, 09:00-17:00 WIB
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-600">humanika@universitas.example</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Respon dalam 1-2 hari kerja
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Alamat
                  </h3>
                  <p className="text-gray-600">
                    Gedung Teknik Lt.3, Universitas Contoh
                  </p>
                  <p className="text-gray-600">Jl. Contoh No. 123</p>
                  <p className="text-gray-600">Kota Contoh, 12345</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Media Sosial
              </h3>
              <div className="flex space-x-4">
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
                    className={`${social.color} text-white p-3 rounded-full transition-colors`}
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
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Kirim Pesan</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-600 z-0 opacity-30" />
            </h2>
            <ContactForm />
          </div>
        </section>

        {/* Map Section */}
        <section className="mt-16 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Lokasi Kami</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-gray-600 text-center">
            Gedung Teknik Lt.3, Universitas Contoh, Jl. Contoh No. 123, Kota
            Contoh
          </p>
        </section>
      </main>
    </div>
  );
}
