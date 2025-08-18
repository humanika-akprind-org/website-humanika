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
    },
    // ... tambahkan data artikel lain jika perlu
  ];

  const events = [
    {
      id: "1",
      title: "Tech Conference 2023",
      date: "2023-11-15",
      category: "Seminar",
      description: "Annual technology conference featuring industry experts",
    },
    // ... tambahkan data event lain jika perlu
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 1. Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-red-700 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl font-bold mb-6">
            Selamat Datang di <span className="text-yellow-300">HUMANIKA</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Himpunan Mahasiswa Informatika yang berdedikasi untuk mengembangkan
            potensi mahasiswa di bidang teknologi informasi.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/about"
              className="px-6 py-3 bg-white text-blue-800 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-lg"
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-yellow-400 text-blue-900 rounded-md hover:bg-yellow-300 transition-colors font-medium shadow-lg"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Artikel Terbaru */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
            Artikel Terbaru
          </h2>
          <Link
            href="/article"
            className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
          >
            Lihat Semua Artikel
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
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
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 3. Tentang Kami */}
      <section className="bg-blue-50 rounded-xl p-8 container mx-auto my-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Tentang HUMANIKA</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 z-0 opacity-30" />
            </h2>
            <p className="text-gray-700 mb-4">
              HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi
              mahasiswa yang mewadahi seluruh mahasiswa Program Studi
              Informatika dalam berbagai kegiatan akademik dan non-akademik.
            </p>
            <Link
              href="/about"
              className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium inline-flex items-center shadow-md mt-4"
            >
              Selengkapnya
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
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
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Visi Misi
            </h3>
            {/* ... (konten visi misi) */}
          </div>
        </div>
      </section>

      {/* 4. Event Terdekat */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Event Terdekat
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 5. Galeri */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
            Galeri Kegiatan
          </h2>
          <Link
            href="/gallery"
            className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
          >
            Lihat Semua Foto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
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
          {/* ... (konten galeri) */}
        </div>
      </section>

      {/* 6. Kontak CTA */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl p-8 container mx-auto my-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Punya pertanyaan atau ingin berkolaborasi? Tim HUMANIKA siap
            membantu Anda.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 rounded-md hover:bg-yellow-300 transition-colors font-medium shadow-lg"
          >
            Kontak Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
