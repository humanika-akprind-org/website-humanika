import type { Event } from "@/types/event";

interface EventCalendarViewProps {
  allEvents: Event[];
}

export default function EventCalendarView({
  allEvents,
}: EventCalendarViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-grey-200 p-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-grey-900 mb-2">Kalender Event</h3>
        <p className="text-grey-600">
          Pilih tanggal untuk melihat event yang tersedia
        </p>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-8">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-grey-700 py-2"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const day = i + 1;
          const hasEvent = allEvents.some(
            (event) => new Date(event.startDate).getDate() === day
          );
          return (
            <div
              key={i}
              className={`h-12 flex items-center justify-center rounded-lg border transition-colors ${
                hasEvent
                  ? "bg-primary-50 border-primary-200 text-primary-700 cursor-pointer hover:bg-primary-100"
                  : "bg-grey-50 border-grey-200 text-grey-400"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
