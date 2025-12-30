import { motion } from "framer-motion";
import { Trophy, ChevronDown } from "lucide-react";
import Link from "next/link";
import PastEventCard from "./PastEventCard";
import type { Event } from "@/types/event";

interface FeaturedPastEventsProps {
  pastEvents: Event[];
}

export default function FeaturedPastEvents({
  pastEvents,
}: FeaturedPastEventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trophy className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-grey-900">
              Event Terdahulu
            </h2>
          </div>
          <p className="text-grey-600">
            Jelajahi event yang telah kami selenggarakan
          </p>
        </div>
        <Link
          href="/event/archive"
          className="group inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <span>Lihat Arsip Lengkap</span>
          <ChevronDown className="w-4 h-4 transform rotate-270 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pastEvents.map((event) => (
          <PastEventCard
            key={event.id}
            id={event.id}
            title={event.name}
            date={event.endDate}
            image={event.thumbnail || undefined}
          />
        ))}
      </div>
    </motion.div>
  );
}
