import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string | Date; // Can be either string or Date object
  category: string;
  // Add any other event properties you might have
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString("id-ID", { month: "short" });
  const day = eventDate.getDate();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-red-600">
      <div className="h-48 bg-red-100 flex items-center justify-center relative">
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
          {event.category}
        </div>
        <div className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full text-sm font-medium shadow-md flex flex-col items-center justify-center w-12 h-12">
          <span className="text-xs font-bold">{month}</span>
          <span className="text-lg font-bold -mt-1">{day}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          {event.title}
        </h3>
        <p
          className="text-gray-600 mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {eventDate.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <Link
            href={`/event/${event.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
