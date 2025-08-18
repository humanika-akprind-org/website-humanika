import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EventDetail({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data based on params.id
  const event = {
    id: params.id,
    title: "Tech Conference 2023",
    date: "2023-11-15T09:00:00",
    location: "Gedung Serba Guna, Universitas Contoh",
    category: "Seminar",
    description: `
      <p class="mb-4">Tech Conference 2023 adalah acara tahunan yang diselenggarakan oleh HUMANIKA yang menghadirkan pembicara-pembicara ternama di industri teknologi.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8 text-blue-800">Apa yang Akan Anda Pelajari?</h2>
      <ul class="list-disc list-inside mb-6 space-y-2">
        <li>Perkembangan terbaru di dunia Artificial Intelligence</li>
        <li>Penerapan blockchain di berbagai industri</li>
        <li>Strategi membangun karir di bidang teknologi</li>
        <li>Workshop hands-on untuk skill teknis terkini</li>
      </ul>
      
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-6">
        <p class="font-medium text-blue-800">Detail Acara:</p>
        <div class="grid md:grid-cols-2 gap-4 mt-2">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-700 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p class="font-medium">Lokasi</p>
              <p class="text-gray-700">Gedung Serba Guna, Universitas Contoh</p>
            </div>
          </div>
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-700 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p class="font-medium">Tanggal & Waktu</p>
              <p class="text-gray-700">15 November 2023, 09:00 - 17:00 WIB</p>
            </div>
          </div>
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-700 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Durasi</p>
              <p class="text-gray-700">8 jam (termasuk istirahat makan siang)</p>
            </div>
          </div>
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-700 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <p class="font-medium">Kapasitas</p>
              <p class="text-gray-700">200 peserta (terbatas)</p>
            </div>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 mt-8 text-blue-800">Pembicara</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((speaker) => (
          <div key={speaker} class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="bg-gray-200 w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-center text-gray-800">Pembicara {speaker}</h3>
            <p class="text-sm text-gray-600 text-center">Spesialis {speaker === 1 ? 'AI' : speaker === 2 ? 'Blockchain' : 'Cloud Computing'}</p>
            <p class="text-xs text-gray-500 text-center mt-2">{speaker === 1 ? 'CTO Tech Company' : speaker === 2 ? 'Lead Developer' : 'Senior Architect'}</p>
          </div>
        ))}
      </div>
    `,
    registrationLink: "#",
  };

  const eventDate = new Date(event.date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Event Header */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-3">
              {event.category}
            </span>
            <span>
              {eventDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" • "}
              {eventDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {event.title}
          </h1>

          <div className="bg-gray-200 h-96 rounded-xl mb-8 flex items-center justify-center">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href={event.registrationLink}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-center shadow-md"
            >
              Daftar Sekarang
            </a>
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-md flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Bagikan
            </button>
          </div>
        </section>

        {/* Event Content */}
        <section className="max-w-2xl mx-auto prose prose-blue prose-lg mb-16">
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </section>

        {/* Location Map */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Lokasi Acara
          </h2>
          <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
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
          <p className="text-center text-gray-700 mt-4">{event.location}</p>
        </section>

        {/* Registration CTA */}
        <section className="max-w-4xl mx-auto bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Tertarik dengan acara ini?
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Daftar sekarang sebelum kehabisan kursi! Tempat terbatas untuk 200
            peserta pertama.
          </p>
          <a
            href={event.registrationLink}
            className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 rounded-md hover:bg-yellow-300 transition-colors font-medium shadow-lg"
          >
            Daftar Sekarang
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
