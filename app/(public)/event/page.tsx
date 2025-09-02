import EventCard from "@/components/public/EventCard";

export default function EventPage() {
  const events = [
    {
      id: "1",
      title: "Tech Conference 2023",
      date: "2023-11-15",
      category: "Seminar",
      description: "Annual technology conference featuring industry experts",
    },
    {
      id: "2",
      title: "Hackathon Nasional",
      date: "2023-12-10",
      category: "Kompetisi",
      description: "48-hour coding competition with exciting prizes",
    },
    {
      id: "3",
      title: "Workshop Machine Learning",
      date: "2024-01-20",
      category: "Workshop",
      description: "Hands-on machine learning workshop for beginners",
    },
    {
      id: "4",
      title: "Web Development Bootcamp",
      date: "2024-02-05",
      category: "Pelatihan",
      description: "Intensive web development training program",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-red-700 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 right-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Event HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Temukan berbagai kegiatan menarik yang kami selenggarakan untuk
              mengembangkan kompetensi di bidang teknologi informasi.
            </p>
          </div>
        </section>

        {/* Event List */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
              Upcoming Events
            </h2>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Filter
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                Calendar View
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-md">
              Load More Events
            </button>
          </div>
        </section>

        {/* Past Events */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
            Past Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Completed
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
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
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    Event Lama {item}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(
                      Date.now() - item * 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                    Lihat Dokumentasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
