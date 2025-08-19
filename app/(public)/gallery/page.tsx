import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";

export default function GalleryPage() {
  const albums = [
    {
      id: 1,
      title: "Tech Conference 2023",
      count: 24,
      cover: "/placeholder-tech.jpg",
    },
    {
      id: 2,
      title: "Hackathon Nasional",
      count: 48,
      cover: "/placeholder-hackathon.jpg",
    },
    {
      id: 3,
      title: "Workshop Series",
      count: 32,
      cover: "/placeholder-workshop.jpg",
    },
    {
      id: 4,
      title: "Kunjungan Industri",
      count: 18,
      cover: "/placeholder-industri.jpg",
    },
    {
      id: 5,
      title: "Pelatihan Dasar",
      count: 27,
      cover: "/placeholder-training.jpg",
    },
    {
      id: 6,
      title: "Kegiatan Sosial",
      count: 15,
      cover: "/placeholder-social.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-red-700 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Galeri HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Dokumentasi kegiatan dan momen berharga bersama Himpunan Mahasiswa
              Informatika.
            </p>
          </div>
        </section>

        {/* Gallery Content */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
              Album Foto
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
              Filter Tahun
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <h3 className="text-white font-medium">{album.title}</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-gray-400 group-hover:scale-105 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {album.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {album.count} foto • Terakhir diupdate 2 minggu lalu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Photo Highlights */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
            Foto Terbaru
          </h2>
          <GalleryGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
