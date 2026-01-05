import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import EventCard from "../../pages/card/event/EventCard";
import type { Event } from "@/types/event";
import { truncateDescription } from "../../pages/event/utils";

interface EventSectionsProps {
  pastEvents: Event[];
  relatedEvents: Event[];
}

export default function EventSections({
  pastEvents,
  relatedEvents,
}: EventSectionsProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Past Events Section */}
        {pastEvents.length > 0 && (
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
          </motion.section>
        )}

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
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
          </motion.section>
        )}
      </div>
    </div>
  );
}
