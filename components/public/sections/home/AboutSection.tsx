"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as FiIcons from "react-icons/fi";
import { ArrowRight, Users, Code, Target, CheckCircle } from "lucide-react";
import { useActivePeriodOrganizationContact } from "@/hooks/organization-contact/useOrganizationContacts";
import { useActivePeriodStatistic } from "@/hooks/statistic/useStatistics";
import type { MissionItem } from "@/types/organization-contact";

// Icon mapping - map database icon names to react-icons/fi components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FiTarget: FiIcons.FiTarget,
  FiStar: FiIcons.FiStar,
  FiHeart: FiIcons.FiHeart,
  FiAward: FiIcons.FiAward,
  FiTrendingUp: FiIcons.FiTrendingUp,
  FiZap: FiIcons.FiZap,
  FiShield: FiIcons.FiShield,
  FiUsers: FiIcons.FiUsers,
  FiGlobe: FiIcons.FiGlobe,
  FiHome: FiIcons.FiHome,
  FiBriefcase: FiIcons.FiBriefcase,
  FiEye: FiIcons.FiEye,
  FiFlag: FiIcons.FiFlag,
  FiBookmark: FiIcons.FiBookmark,
  FiMapPin: FiIcons.FiMapPin,
  FiPhone: FiIcons.FiPhone,
  FiMail: FiIcons.FiMail,
  FiClock: FiIcons.FiClock,
  FiCalendar: FiIcons.FiCalendar,
  FiActivity: FiIcons.FiActivity,
  FiAlertCircle: FiIcons.FiAlertCircle,
  FiAnchor: FiIcons.FiAnchor,
  FiArchive: FiIcons.FiArchive,
  FiBarChart: FiIcons.FiBarChart,
  FiBattery: FiIcons.FiBattery,
  FiBell: FiIcons.FiBell,
  FiBox: FiIcons.FiBox,
  FiCast: FiIcons.FiCast,
  FiCheck: FiIcons.FiCheck,
  FiCheckCircle: FiIcons.FiCheckCircle,
  FiCheckSquare: FiIcons.FiCheckSquare,
  FiCircle: FiIcons.FiCircle,
  FiClipboard: FiIcons.FiClipboard,
  FiCloud: FiIcons.FiCloud,
  FiCode: FiIcons.FiCode,
  FiCommand: FiIcons.FiCommand,
  FiCompass: FiIcons.FiCompass,
  FiCopy: FiIcons.FiCopy,
  FiCpu: FiIcons.FiCpu,
  FiCreditCard: FiIcons.FiCreditCard,
  FiDatabase: FiIcons.FiDatabase,
  FiDelete: FiIcons.FiDelete,
  FiDisc: FiIcons.FiDisc,
  FiDownload: FiIcons.FiDownload,
  FiEdit: FiIcons.FiEdit,
  FiExternalLink: FiIcons.FiExternalLink,
  FiFacebook: FiIcons.FiFacebook,
  FiFastForward: FiIcons.FiFastForward,
  FiFeather: FiIcons.FiFeather,
  FiFile: FiIcons.FiFile,
  FiFileMinus: FiIcons.FiFileMinus,
  FiFilePlus: FiIcons.FiFilePlus,
  FiFileText: FiIcons.FiFileText,
  FiFilm: FiIcons.FiFilm,
  FiFilter: FiIcons.FiFilter,
  FiFolder: FiIcons.FiFolder,
  FiFolderMinus: FiIcons.FiFolderMinus,
  FiFolderPlus: FiIcons.FiFolderPlus,
  FiGift: FiIcons.FiGift,
  FiGithub: FiIcons.FiGithub,
  FiGitlab: FiIcons.FiGitlab,
  FiGrid: FiIcons.FiGrid,
  FiHash: FiIcons.FiHash,
  FiHeadphones: FiIcons.FiHeadphones,
  FiHelpCircle: FiIcons.FiHelpCircle,
  FiHexagon: FiIcons.FiHexagon,
  FiImage: FiIcons.FiImage,
  FiInbox: FiIcons.FiInbox,
  FiInfo: FiIcons.FiInfo,
  FiInstagram: FiIcons.FiInstagram,
  FiLayers: FiIcons.FiLayers,
  FiLayout: FiIcons.FiLayout,
  FiLifeBuoy: FiIcons.FiLifeBuoy,
  FiLink: FiIcons.FiLink,
  FiLinkedin: FiIcons.FiLinkedin,
  FiList: FiIcons.FiList,
  FiLoader: FiIcons.FiLoader,
  FiLock: FiIcons.FiLock,
  FiLogIn: FiIcons.FiLogIn,
  FiLogOut: FiIcons.FiLogOut,
  FiMap: FiIcons.FiMap,
  FiMaximize: FiIcons.FiMaximize,
  FiMaximize2: FiIcons.FiMaximize2,
  FiMenu: FiIcons.FiMenu,
  FiMessageCircle: FiIcons.FiMessageCircle,
  FiMessageSquare: FiIcons.FiMessageSquare,
  FiMic: FiIcons.FiMic,
  FiMicOff: FiIcons.FiMicOff,
  FiMinimize: FiIcons.FiMinimize,
  FiMinimize2: FiIcons.FiMinimize2,
  FiMinus: FiIcons.FiMinus,
  FiMinusCircle: FiIcons.FiMinusCircle,
  FiMinusSquare: FiIcons.FiMinusSquare,
  FiMonitor: FiIcons.FiMonitor,
  FiMoon: FiIcons.FiMoon,
  FiMoreHorizontal: FiIcons.FiMoreHorizontal,
  FiMoreVertical: FiIcons.FiMoreVertical,
  FiMove: FiIcons.FiMove,
  FiMusic: FiIcons.FiMusic,
  FiNavigation: FiIcons.FiNavigation,
  FiNavigation2: FiIcons.FiNavigation2,
  FiOctagon: FiIcons.FiOctagon,
  FiPackage: FiIcons.FiPackage,
  FiPaperclip: FiIcons.FiPaperclip,
  FiPause: FiIcons.FiPause,
  FiPauseCircle: FiIcons.FiPauseCircle,
  FiPenTool: FiIcons.FiPenTool,
  FiPercent: FiIcons.FiPercent,
  FiPieChart: FiIcons.FiPieChart,
  FiPlay: FiIcons.FiPlay,
  FiPlayCircle: FiIcons.FiPlayCircle,
  FiPlus: FiIcons.FiPlus,
  FiPlusCircle: FiIcons.FiPlusCircle,
  FiPlusSquare: FiIcons.FiPlusSquare,
  FiPower: FiIcons.FiPower,
  FiPrinter: FiIcons.FiPrinter,
  FiRadio: FiIcons.FiRadio,
  FiRefreshCw: FiIcons.FiRefreshCw,
  FiRepeat: FiIcons.FiRepeat,
  FiRewind: FiIcons.FiRewind,
  FiRotateCcw: FiIcons.FiRotateCcw,
  FiRotateCw: FiIcons.FiRotateCw,
  FiSave: FiIcons.FiSave,
  FiScissors: FiIcons.FiScissors,
  FiSearch: FiIcons.FiSearch,
  FiSend: FiIcons.FiSend,
  FiServer: FiIcons.FiServer,
  FiSettings: FiIcons.FiSettings,
  FiShare: FiIcons.FiShare,
  FiShare2: FiIcons.FiShare2,
  FiShieldOff: FiIcons.FiShieldOff,
  FiShoppingBag: FiIcons.FiShoppingBag,
  FiShoppingCart: FiIcons.FiShoppingCart,
  FiShuffle: FiIcons.FiShuffle,
  FiSidebar: FiIcons.FiSidebar,
  FiSkipBack: FiIcons.FiSkipBack,
  FiSkipForward: FiIcons.FiSkipForward,
  FiSlack: FiIcons.FiSlack,
  FiSliders: FiIcons.FiSliders,
  FiSmartphone: FiIcons.FiSmartphone,
  FiSmile: FiIcons.FiSmile,
  FiSquare: FiIcons.FiSquare,
  FiStopCircle: FiIcons.FiStopCircle,
  FiSun: FiIcons.FiSun,
  FiTablet: FiIcons.FiTablet,
  FiTag: FiIcons.FiTag,
  FiTerminal: FiIcons.FiTerminal,
  FiThermometer: FiIcons.FiThermometer,
  FiThumbsDown: FiIcons.FiThumbsDown,
  FiThumbsUp: FiIcons.FiThumbsUp,
  FiToggleLeft: FiIcons.FiToggleLeft,
  FiToggleRight: FiIcons.FiToggleRight,
  FiTrash: FiIcons.FiTrash,
  FiTrash2: FiIcons.FiTrash2,
  FiTriangle: FiIcons.FiTriangle,
  FiTruck: FiIcons.FiTruck,
  FiTv: FiIcons.FiTv,
  FiTwitter: FiIcons.FiTwitter,
  FiType: FiIcons.FiType,
  FiUmbrella: FiIcons.FiUmbrella,
  FiUnlock: FiIcons.FiUnlock,
  FiUpload: FiIcons.FiUpload,
  FiUser: FiIcons.FiUser,
  FiUserCheck: FiIcons.FiUserCheck,
  FiUserMinus: FiIcons.FiUserMinus,
  FiUserPlus: FiIcons.FiUserPlus,
  FiUserX: FiIcons.FiUserX,
  FiVideo: FiIcons.FiVideo,
  FiVideoOff: FiIcons.FiVideoOff,
  FiVolume: FiIcons.FiVolume,
  FiVolume2: FiIcons.FiVolume2,
  FiVolumeX: FiIcons.FiVolumeX,
  FiWatch: FiIcons.FiWatch,
  FiWifi: FiIcons.FiWifi,
  FiX: FiIcons.FiX,
  FiXCircle: FiIcons.FiXCircle,
  FiXSquare: FiIcons.FiXSquare,
  FiYoutube: FiIcons.FiYoutube,
  FiZoomIn: FiIcons.FiZoomIn,
  FiZoomOut: FiIcons.FiZoomOut,
};

// Fallback icons when icon is not specified or not found
const FALLBACK_ICONS: React.ComponentType<{ className?: string }>[] = [
  FiIcons.FiTarget,
  FiIcons.FiStar,
  FiIcons.FiHeart,
  FiIcons.FiAward,
  FiIcons.FiTrendingUp,
  FiIcons.FiZap,
  FiIcons.FiShield,
  FiIcons.FiUsers,
];

// Get icon component by name, with fallback
function getIconByName(
  iconName?: string
): React.ComponentType<{ className?: string }> {
  if (!iconName || !ICON_MAP[iconName]) {
    return FALLBACK_ICONS[Math.floor(Math.random() * FALLBACK_ICONS.length)];
  }
  return ICON_MAP[iconName];
}

// Helper to render icon with proper styling
function renderMissionIcon(
  iconName?: string,
  className: string = "w-5 h-5"
): React.ReactNode {
  const IconComponent = getIconByName(iconName);
  return <IconComponent className={className} />;
}

interface ParsedMission {
  number: string;
  title: string;
  description: string;
  icon?: string;
  iconNode: React.ReactNode;
}

export default function AboutSection() {
  const { organizationContact, isLoading: orgLoading } =
    useActivePeriodOrganizationContact();
  const { statistic, isLoading: statLoading } = useActivePeriodStatistic();

  // Handle mission array from database (stored as Json)
  // Supports: string, string[], MissionItem[]
  const rawMissions = organizationContact?.mission
    ? Array.isArray(organizationContact.mission)
      ? organizationContact.mission
      : [organizationContact.mission as string]
    : [];

  // Parse missions - support both old format and new format with icons
  const missions: ParsedMission[] = rawMissions.map((missionItem, index) => {
    // Check if it is the new MissionItem format with icon
    if (
      typeof missionItem === "object" &&
      missionItem !== null &&
      "title" in missionItem
    ) {
      const item = missionItem as MissionItem;
      return {
        number: String(index + 1).padStart(2, "0"),
        title: item.title,
        description: item.description,
        icon: item.icon,
        iconNode: renderMissionIcon(item.icon),
      };
    }

    // Old format: "title - description" string or just string
    const missionStr = missionItem as string;
    const parts = missionStr.split(" - ");
    return {
      number: String(index + 1).padStart(2, "0"),
      title: parts[0]?.trim() || "",
      description: parts[1]?.trim() || parts[0]?.trim() || "",
      icon: undefined,
      iconNode: renderMissionIcon(),
    };
  });

  // Default missions when no data available
  const defaultMissions: ParsedMission[] = [
    {
      number: "01",
      title: "Meningkatkan Kompetensi",
      description:
        "Meningkatkan kompetensi anggota di bidang teknologi informasi",
      iconNode: renderMissionIcon("FiCode"),
    },
    {
      number: "02",
      title: "Kolaborasi",
      description: "Menjalin kolaborasi dengan industri dan komunitas",
      iconNode: renderMissionIcon("FiUsers"),
    },
    {
      number: "03",
      title: "Inovasi",
      description: "Mengembangkan solusi inovatif untuk masalah sosial",
      iconNode: renderMissionIcon("FiZap"),
    },
    {
      number: "04",
      title: "Ekosistem Pembelajaran",
      description: "Membangun ekosistem pembelajaran berkelanjutan",
      iconNode: renderMissionIcon("FiBook"),
    },
  ];

  const displayMissions = missions.length > 0 ? missions : defaultMissions;

  return (
    <section className="py-20 bg-gradient-to-br from-grey-50 to-primary-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full blur-xl opacity-60" />
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-10">
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  TENTANG KAMI
                </div>
                <h2 className="text-4xl font-bold text-grey-900 mb-6">
                  Mengenal <span className="text-primary-700">HUMANIKA</span>
                </h2>
                <p className="text-lg text-grey-700 mb-8 leading-relaxed">
                  HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi
                  mahasiswa yang mewadahi seluruh mahasiswa Program Studi
                  Informatika dalam berbagai kegiatan akademik dan non-akademik
                  untuk menciptakan lingkungan yang mendukung pengembangan
                  keterampilan teknis dan soft skills.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading ? "..." : statistic?.activeMembers || 0}
                        </div>
                        <div className="text-xs text-grey-600">
                          Anggota Aktif
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading
                            ? "..."
                            : statistic?.collaborativeProjects || 0}
                        </div>
                        <div className="text-xs text-grey-600">
                          Proyek Kolaboratif
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading
                            ? "..."
                            : statistic?.innovationProjects || 0}
                        </div>
                        <div className="text-xs text-grey-600">
                          Proyek Inovasi
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary-700">
                          {statLoading
                            ? "..."
                            : statistic?.memberSatisfaction || 0}
                          %
                        </div>
                        <div className="text-xs text-grey-600">
                          Kepuasan Anggota
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-grey-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-grey-900">Visi Kami</h3>
                  <p className="text-sm text-grey-500">
                    Masa Depan yang Kita Ciptakan
                  </p>
                </div>
              </div>
              <p className="text-grey-700 text-lg leading-relaxed">
                {orgLoading
                  ? "Memuat visi..."
                  : organizationContact?.vision ||
                    "Menjadi wadah utama pengembangan talenta digital yang inovatif dan kolaboratif untuk menciptakan dampak positif bagi masyarakat melalui teknologi informasi."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Misi Kami</h3>
                  <p className="text-sm text-primary-200">
                    Komitmen untuk Berkontribusi
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                {displayMissions.map((mission, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-primary-300 rounded-full" />
                    </div>
                    <div>
                      <span className="font-semibold block">
                        {mission.title}
                      </span>
                      {mission.description !== mission.title && (
                        <span className="text-primary-200 text-sm">
                          {mission.description}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
