import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Clock } from "lucide-react";
import EventCard from "../../pages/card/event/EventCard";
import type { Event } from "@/types/event";
import { truncateDescription } from "../../pages/event/utils";
import RelatedEventsEmptyState from "../../pages/event/RelatedEventsEmptyState";

interface EventSectionsProps {
  pastEvents: Event[];
  relatedEvents: Event[];
}

export default function EventSections({
  pastEvents,
  relatedEvents,
}: EventSectionsProps) {
  const router = useRouter();

  // Empty state for past events
  const PastEventsEmpty = () => (
    <div className="text-center py-16">
      <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
          <Clock className="w-12 h-12 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-grey-900 mb-2">
            Tidak Ada Acara Sebelumnya
          </h3>
          <p className="text-grey-600">
            Belum ada acara yang telah berlangsung untuk ditampilkan.
          </p>
        </div>
        <button
          onClick={() => router.push("/events")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <Calendar className="w-4 h-4" />
          Jelajahi Semua Acara
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Past Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-grey-900">
                Acara Sebelumnya
              </h2>
              <p className="text-grey-600">
                Jelajahi acara-acara HUMANIKA yang telah berlangsung
              </p>
            </div>
            <button
              onClick={() => router.push("/events")}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {pastEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  truncatedDescription={truncateDescription(event.description)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <PastEventsEmpty />
          )}
        </motion.section>

        {/* Related Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-grey-900">
                Acara Terkait
              </h2>
              <p className="text-grey-600">
                Jelajahi acara HUMANIKA lainnya dari kategori atau departemen
                yang sama
              </p>
            </div>
            <button
              onClick={() => router.push("/events")}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {relatedEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent, index) => (
                <EventCard
                  key={relatedEvent.id}
                  event={relatedEvent}
                  truncatedDescription={truncateDescription(
                    relatedEvent.description
                  )}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <RelatedEventsEmptyState />
          )}
        </motion.section>
      </div>
    </div>
  );
}
