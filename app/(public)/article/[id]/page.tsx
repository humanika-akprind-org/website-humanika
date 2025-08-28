export default function ArticleDetail({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data based on params.id
  const article = {
    id: params.id,
    title: "Perkembangan AI di Tahun 2023",
    date: "2023-10-15",
    category: "Teknologi",
    content: `
      <p class="mb-4">Artificial Intelligence (AI) telah mengalami perkembangan pesat di tahun 2023, dengan berbagai terobosan baru yang mengubah cara kita berinteraksi dengan teknologi.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8 text-blue-800">Transformasi di Berbagai Industri</h2>
      <p class="mb-4">AI telah diterapkan di berbagai sektor industri, mulai dari kesehatan hingga keuangan. Di bidang kesehatan, algoritma AI mampu mendiagnosis penyakit dengan akurasi yang melebihi dokter manusia dalam beberapa kasus tertentu.</p>
      
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-6">
        <p class="font-medium text-blue-800">Fakta Cepat:</p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Market size AI diperkirakan mencapai $500 miliar di 2023</li>
          <li>70% perusahaan telah mengadopsi setidaknya satu bentuk teknologi AI</li>
          <li>Generative AI seperti ChatGPT mencapai 100 juta pengguna dalam 2 bulan</li>
        </ul>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 mt-8 text-blue-800">Tantangan dan Etika</h2>
      <p class="mb-4">Dengan perkembangan pesat ini, muncul juga berbagai tantangan terkait etika penggunaan AI. Isu privasi data, bias algoritma, dan potensi penggantian pekerjaan manusia menjadi topik hangat di berbagai forum internasional.</p>
      
      <figure class="my-8">
        <div class="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <figcaption class="text-center text-sm text-gray-500 mt-2">Ilustrasi perkembangan AI di berbagai sektor industri</figcaption>
      </figure>
      
      <h2 class="text-2xl font-bold mb-4 mt-8 text-blue-800">Masa Depan AI</h2>
      <p class="mb-4">Para ahli memprediksi bahwa perkembangan AI akan semakin pesat dengan munculnya teknologi-teknologi baru seperti quantum computing yang akan mempercepat kemampuan pemrosesan data AI secara eksponensial.</p>
    `,
    author: {
      name: "Jane Doe",
      role: "AI Researcher",
      avatar: "/placeholder-avatar.jpg",
    },
    relatedArticles: [
      {
        id: "2",
        title: "Blockchain Beyond Cryptocurrency",
        excerpt:
          "Eksplorasi penggunaan teknologi blockchain di luar dunia cryptocurrency.",
        date: "2023-07-22",
      },
      {
        id: "3",
        title: "Workshop Flutter Sukses Digelar",
        excerpt:
          "Laporan lengkap tentang workshop Flutter yang dihadiri oleh 150 peserta.",
        date: "2023-09-28",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Article Header */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-3">
              {article.category}
            </span>
            <span>
              {new Date(article.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {article.title}
          </h1>

          <div className="flex items-center mb-8">
            <div className="bg-gray-200 w-10 h-10 rounded-full mr-3 overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.author.role}</p>
            </div>
          </div>

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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </section>

        {/* Article Content */}
        <section className="max-w-2xl mx-auto prose prose-blue prose-lg mb-16">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </section>

        {/* Author Bio */}
        <section className="max-w-4xl mx-auto bg-blue-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Tentang Penulis
          </h2>
          <div className="flex items-start">
            <div className="bg-gray-200 w-16 h-16 rounded-full mr-6 overflow-hidden flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {article.author.name}
              </h3>
              <p className="text-gray-700 mb-4">
                {article.author.role} dengan pengalaman lebih dari 5 tahun di
                bidang Artificial Intelligence. Telah menerbitkan berbagai
                penelitian di jurnal internasional dan aktif sebagai pembicara
                di berbagai konferensi teknologi.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                Lihat Profil Lengkap
              </button>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
            Artikel Terkait
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {article.relatedArticles.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
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
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <a
                    href={`/article/${item.id}`}
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
                  >
                    Baca Selengkapnya
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
