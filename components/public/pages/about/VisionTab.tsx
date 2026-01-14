import { motion } from "framer-motion";
import {
  Target,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Heart,
} from "lucide-react";
import { useActivePeriodOrganizationContact } from "@/hooks/organization-contact/useOrganizationContacts";

// Icon mapping for missions
const MISSION_ICONS = [
  <GraduationCap key="graduation" className="w-6 h-6" />,
  <Briefcase key="briefcase" className="w-6 h-6" />,
  <Lightbulb key="lightbulb" className="w-6 h-6" />,
  <Heart key="heart" className="w-6 h-6" />,
];

interface ParsedMission {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Skeleton Components for Loading States
function VisionCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 md:p-12 text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
            <Target className="w-8 h-8 opacity-50" />
          </div>
          <div>
            <div className="h-3 w-20 bg-white/20 rounded animate-pulse mb-2" />
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-3xl">
          <div className="h-10 md:h-12 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function MissionCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className={`grid gap-6 ${
        count === 1
          ? "grid-cols-1 max-w-lg mx-auto"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-grey-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-grey-100 rounded-lg animate-pulse" />
            <div className="w-12 h-12 bg-grey-100 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-grey-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-grey-50 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-grey-50 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-grey-50 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function VisionTab() {
  const { organizationContact, isLoading: orgLoading } =
    useActivePeriodOrganizationContact();

  // Handle mission array from database (stored as Json)
  const rawMissions = organizationContact?.mission
    ? Array.isArray(organizationContact.mission)
      ? organizationContact.mission
      : [organizationContact.mission as string]
    : [];

  // Parse missions: "title - description" format
  const missions: ParsedMission[] = rawMissions.map((missionStr, index) => {
    const parts = missionStr.split(" - ");
    return {
      number: String(index + 1).padStart(2, "0"),
      title: parts[0]?.trim() || "",
      description: parts[1]?.trim() || parts[0]?.trim() || "",
      icon: MISSION_ICONS[index % MISSION_ICONS.length],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16"
    >
      {/* Vision Card */}
      {orgLoading ? (
        <VisionCardSkeleton />
      ) : (
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-semibold text-primary-200 uppercase tracking-wider">
                  ARAH & TUJUAN
                </div>
                <h2 className="text-3xl font-bold">Visi Kami</h2>
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-2xl md:text-3xl font-medium leading-relaxed text-primary-100">
                &quot;
                {organizationContact?.vision ||
                  "Menjadi wadah utama pengembangan talenta digital yang inovatif, kolaboratif, dan berdaya saing global untuk menciptakan dampak positif berkelanjutan dalam masyarakat digital."}
                &quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mission Section */}
      <div>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
            STRATEGI PENCAPAIAN
          </div>
          <h2 className="text-4xl font-bold text-grey-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Misi
            </span>{" "}
            yang Kami Jalankan
          </h2>
        </div>

        {orgLoading ? (
          <MissionCardSkeleton count={4} />
        ) : (
          <div
            className={`grid gap-6 ${
              missions.length === 1
                ? "grid-cols-1 max-w-lg mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {missions.map((mission, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border border-grey-200 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-5xl font-black text-primary-100 group-hover:text-primary-200 transition-colors">
                    {mission.number}
                  </div>
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <div className="text-primary-600">{mission.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-grey-900 mb-3">
                  {mission.title}
                </h3>
                <p className="text-grey-600 text-sm leading-relaxed">
                  {mission.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
