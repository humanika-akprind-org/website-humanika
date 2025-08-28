export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 right-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Tentang HUMANIKA</h1>
            <p className="text-xl max-w-3xl">
              Himpunan Mahasiswa Informatika yang berdedikasi untuk
              mengembangkan potensi mahasiswa di bidang teknologi informasi.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Sejarah Kami</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 z-0 opacity-30" />
            </h2>
            <p className="text-gray-700 mb-4">
              HUMANIKA (Himpunan Mahasiswa Informatika) didirikan pada tahun
              2005 sebagai wadah bagi mahasiswa Program Studi Informatika untuk
              mengembangkan diri baik secara akademik maupun non-akademik.
            </p>
            <p className="text-gray-700 mb-6">
              Selama lebih dari 15 tahun, kami telah meluluskan ratusan anggota
              yang berkontribusi di berbagai bidang teknologi informasi, baik di
              industri maupun akademik.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Fakta Cepat
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    <strong>200+</strong> Anggota Aktif
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    <strong>50+</strong> Event Tahunan
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    <strong>30+</strong> Proyek Inovasi
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Visi & Misi</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-600 z-0 opacity-30" />
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Visi
                  </h3>
                  <p className="text-gray-700">
                    Menjadi himpunan mahasiswa informatika terdepan dalam
                    pengembangan teknologi dan karakter anggota yang berdaya
                    saing global.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Misi
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 pl-1">
                    <li>
                      Meningkatkan kompetensi teknis dan soft skill anggota
                      melalui berbagai program pengembangan
                    </li>
                    <li>
                      Membangun jaringan dengan industri, akademisi, dan
                      komunitas IT
                    </li>
                    <li>
                      Menyelenggarakan kegiatan yang mendukung pengembangan
                      akademik dan karakter
                    </li>
                    <li>
                      Berkontribusi pada pengembangan teknologi informasi di
                      masyarakat
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Struktur Organisasi
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-center">
              <div className="relative">
                {/* CEO/President */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 rounded-lg shadow-lg text-center w-64 mx-auto mb-8 relative z-10">
                  <div className="bg-white p-1 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
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
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold">Ketua Umum</h3>
                  <p className="text-blue-200 text-sm">John Doe</p>
                </div>

                {/* Divisions */}
                <div className="flex flex-wrap justify-center gap-6 relative">
                  {/* Line connectors */}
                  <div className="absolute top-0 left-1/2 w-1 h-8 bg-gray-300 transform -translate-x-1/2"/>

                  {[
                    "Sekretariat",
                    "Bendahara",
                    "Divisi Akademik",
                    "Divisi Kominfo",
                    "Divisi Minat Bakat",
                  ].map((division, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-blue-600 p-3 rounded-lg shadow-md text-center w-48 relative"
                    >
                      <div className="bg-blue-100 p-1 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {division}
                      </h4>
                      <div className="absolute top-0 left-1/2 w-1 h-6 bg-gray-300 transform -translate-x-1/2 -translate-y-full"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
