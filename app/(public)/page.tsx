import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import EventCard from "@/components/EventCard";

export default function Home() {
  // Data contoh untuk demo
  const articles = [
    {
      id: "1",
      title: "Perkembangan AI di Tahun 2023",
      date: "2023-10-15",
      category: "Teknologi",
      excerpt:
        "Bagaimana perkembangan teknologi AI di tahun 2023 dan dampaknya bagi industri.",
      author: "Jane Doe",
      image: "/images/ai-article.jpg",
    },
    {
      id: "2",
      title: "Workshop Pemrograman Web Modern",
      date: "2023-10-10",
      category: "Edukasi",
      excerpt:
        "Pelajari teknik-teknik terbaru dalam pengembangan website modern.",
      author: "John Smith",
      image: "/images/web-dev.jpg",
    },
    {
      id: "3",
      title: "Inovasi Teknologi untuk Sustainable Development",
      date: "2023-10-05",
      category: "Sustainability",
      excerpt: "Peran teknologi dalam mendukung pembangunan berkelanjutan.",
      author: "Sarah Johnson",
      image: "/images/sustainable-tech.jpg",
    },
  ];

  const events = [
    {
      id: "1",
      title: "Tech Conference 2023",
      date: "2023-11-15",
      category: "Seminar",
      description: "Annual technology conference featuring industry experts",
      image: "/images/tech-conf.jpg",
      location: "Auditorium Utama",
    },
    {
      id: "2",
      title: "Hackathon Inovasi Digital",
      date: "2023-12-05",
      category: "Kompetisi",
      description: "Kompetisi coding marathon selama 24 jam",
      image: "/images/hackathon.jpg",
      location: "Lab Komputer Gedung B",
    },
    {
      id: "3",
      title: "Webinar Data Science",
      date: "2023-11-22",
      category: "Webinar",
      description: "Belajar teknik analisis data terkini",
      image: "/images/datascience.jpg",
      location: "Online via Zoom",
    },
  ];

  const galleryImages = [
    { id: 1, src: "/images/gallery1.jpg", alt: "Kegiatan Seminar" },
    { id: 2, src: "/images/gallery2.jpg", alt: "Workshop Programming" },
    { id: 3, src: "/images/gallery3.jpg", alt: "Diskusi Kelompok" },
    { id: 4, src: "/images/gallery4.jpg", alt: "Presentasi Projek" },
    { id: 5, src: "/images/gallery5.jpg", alt: "Networking Session" },
    { id: 6, src: "/images/gallery6.jpg", alt: "Tech Demo" },
    { id: 7, src: "/images/gallery7.jpg", alt: "Team Building" },
    { id: 8, src: "/images/gallery8.jpg", alt: "Awarding Night" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-red-800 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-red-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-52 h-52 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse delay-2000" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Selamat Datang di{" "}
              <span className="text-yellow-300">HUMANIKA</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Himpunan Mahasiswa Informatika yang berdedikasi untuk
              mengembangkan potensi mahasiswa di bidang teknologi informasi.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/about"
                className="px-8 py-3 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Tentang Kami
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"/>
      </section>

      {/* 2. Artikel Terbaru */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block">
              Artikel Terbaru
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-600 opacity-20 -z-10 rounded-full"/>
            </h2>
            <p className="mt-2 text-gray-600">
              Temukan wawasan dan informasi terkini dari dunia teknologi
            </p>
          </div>
          <Link
            href="/article"
            className="group flex items-center text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            Lihat Semua Artikel
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 3. Tentang Kami */}
      <section className="bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl p-8 md:p-12 container mx-auto my-16 md:my-24 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10"/>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full opacity-10"/>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              Tentang HUMANIKA
              <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 opacity-60"/>
            </h2>
            <p className="text-blue-100 mb-4 text-lg leading-relaxed">
              HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi
              mahasiswa yang mewadahi seluruh mahasiswa Program Studi
              Informatika dalam berbagai kegiatan akademik dan non-akademik.
            </p>
            <p className="text-blue-100 mb-6 text-lg leading-relaxed">
              Sejak didirikan pada tahun 2010, kami telah menjadi wadah
              pengembangan bakat dan minat di bidang teknologi informasi bagi
              lebih dari 500 anggota.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium shadow-md mt-4 group"
            >
              Selengkapnya
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-400">
            <h3 className="text-2xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-2"/>
              Visi Misi Kami
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-700 mb-1">Visi</h4>
                <p className="text-gray-700">
                  Menjadi organisasi mahasiswa informatika terdepan dalam
                  inovasi dan pengembangan teknologi yang bermanfaat bagi
                  masyarakat.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-1">Misi</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Meningkatkan kompetensi anggota di bidang teknologi
                    informasi
                  </li>
                  <li>
                    Mendorong inovasi dan kreativitas dalam pengembangan
                    teknologi
                  </li>
                  <li>
                    Memperkuat jejaring dengan industri dan komunitas teknologi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Event Terdekat */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Event Terdekat
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti berbagai acara dan kegiatan menarik yang kami selenggarakan
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-md"
          >
            Lihat Semua Event
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* 5. Galeri */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block">
              Galeri Kegiatan
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-600 opacity-20 -z-10 rounded-full"/>
            </h2>
            <p className="mt-2 text-gray-600">
              Rekam momen dari berbagai kegiatan HUMANIKA
            </p>
          </div>
          <Link
            href="/gallery"
            className="group flex items-center text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            Lihat Semua Foto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.slice(0, 8).map((image) => (
            <div
              key={image.id}
              className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full h-full bg-gray-200 animate-pulse"/>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Kontak CTA */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-8 md:p-12 container mx-auto my-16 md:my-24 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full opacity-10"/>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500 rounded-full opacity-10"/>

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tertarik untuk Bergabung?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Punya pertanyaan atau ingin berkolaborasi? Tim HUMANIKA siap
            membantu Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Kontak Sekarang
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300 font-semibold"
            >
              Daftar Menjadi Anggota
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
