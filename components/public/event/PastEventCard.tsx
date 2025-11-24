import Link from "next/link";

interface PastEventCardProps {
  id: string;
  title: string;
  date: Date | string;
}

export default function PastEventCard({ id, title, date }: PastEventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-3">
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <Link href={`/gallery/${id}`}>
          <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
            Lihat Dokumentasi
          </button>
        </Link>
      </div>
    </div>
  );
}
