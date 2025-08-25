interface AlbumCardProps {
  album: {
    id: number;
    title: string;
    count: number;
    cover?: string;
  };
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
  );
}
