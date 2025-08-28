export default function GalleryDetail({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data based on params.id
  const album = {
    id: params.id,
    title: "Tech Conference 2023",
    date: "2023-11-15",
    description:
      "Dokumentasi lengkap dari Tech Conference 2023 yang diselenggarakan oleh HUMANIKA dengan berbagai pembicara dari industri teknologi.",
    photos: Array.from({ length: 24 }).map((_, i) => ({
      id: i + 1,
      title: `Foto ${i + 1} dari Tech Conference 2023`,
      url: "/placeholder-photo.jpg",
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Album Header */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>
              {new Date(album.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="mx-2">•</span>
            <span>{album.photos.length} foto</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {album.title}
          </h1>
          <p className="text-lg text-gray-700 mb-8">{album.description}</p>

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

        {/* Photo Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
            Semua Foto
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <h3 className="text-white font-medium text-sm">
                    {photo.title}
                  </h3>
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
            ))}
          </div>
        </section>

        {/* Related Albums */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
            Album Lainnya
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "2",
                title: "Hackathon Nasional",
                count: 48,
                cover: "/placeholder-hackathon.jpg",
              },
              {
                id: "3",
                title: "Workshop Series",
                count: 32,
                cover: "/placeholder-workshop.jpg",
              },
              {
                id: "4",
                title: "Kunjungan Industri",
                count: 18,
                cover: "/placeholder-industri.jpg",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <h3 className="text-white font-medium">{item.title}</h3>
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
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {item.count} foto • Terakhir diupdate 2 minggu lalu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
