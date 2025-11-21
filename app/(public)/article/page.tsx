import ArticleCard from "@/components/public/article/ArticleCard";

export default function ArticlePage() {
  const articles = [
    {
      id: 1,
      title: "Perkembangan AI di Tahun 2023",
      date: "2023-10-15",
      category: "Teknologi",
      excerpt:
        "Bagaimana perkembangan teknologi AI di tahun 2023 dan dampaknya bagi industri.",
      author: "Jane Doe",
    },
    {
      id: 2,
      title: "Workshop Flutter Sukses Digelar",
      date: "2023-09-28",
      category: "Event",
      excerpt:
        "Laporan lengkap tentang workshop Flutter yang dihadiri oleh 150 peserta.",
      author: "John Smith",
    },
    {
      id: 3,
      title: "Tips Membangun Portofolio untuk Developer Pemula",
      date: "2023-08-10",
      category: "Karir",
      excerpt:
        "Panduan praktis untuk developer pemula dalam membangun portofolio yang menarik.",
      author: "Alex Johnson",
    },
    {
      id: 4,
      title: "Blockchain Beyond Cryptocurrency",
      date: "2023-07-22",
      category: "Teknologi",
      excerpt:
        "Eksplorasi penggunaan teknologi blockchain di luar dunia cryptocurrency.",
      author: "Sarah Williams",
    },
    {
      id: 5,
      title: "HUMANIKA Meraih Juara Hackathon Nasional",
      date: "2023-06-15",
      category: "Prestasi",
      excerpt:
        "Tim HUMANIKA berhasil meraih juara pertama dalam kompetisi hackathon nasional.",
      author: "Michael Brown",
    },
    {
      id: 6,
      title: "Memulai Karir di Dunia Data Science",
      date: "2023-05-30",
      category: "Karir",
      excerpt:
        "Panduan untuk mahasiswa yang ingin memulai karir di bidang data science.",
      author: "Emily Davis",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Artikel HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Temukan artikel menarik seputar teknologi, karir, dan kegiatan
              mahasiswa informatika.
            </p>
          </div>
        </section>

        {/* Article List */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
              Artikel Terbaru
            </h2>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                <option>Semua Kategori</option>
                <option>Teknologi</option>
                <option>Event</option>
                <option>Karir</option>
                <option>Prestasi</option>
              </select>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                Urutkan
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md">
              Muat Lebih Banyak
            </button>
          </div>
        </section>

        {/* Popular Tags */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Populer Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Teknologi",
              "AI",
              "Workshop",
              "Karir",
              "Hackathon",
              "Blockchain",
              "Web Development",
              "Data Science",
              "Mobile",
              "Cloud Computing",
            ].map((tag, index) => (
              <a
                key={index}
                href="#"
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  index % 3 === 0
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : index % 3 === 1
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
              >
                #{tag}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
