import { motion } from "framer-motion";
import * as FiIcons from "react-icons/fi";
import { useActivePeriodOrganizationContact } from "@/hooks/organization-contact/useOrganizationContacts";
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
  FiEyeOff: FiIcons.FiEyeOff,
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

interface ParsedMission {
  number: string;
  title: string;
  description: string;
  icon?: string;
  iconNode: React.ReactNode;
}

// Helper to render icon with proper styling
function renderMissionIcon(
  iconName?: string,
  className: string = "w-6 h-6"
): React.ReactNode {
  const IconComponent = getIconByName(iconName);
  return <IconComponent className={className} />;
}

// Skeleton Components for Loading States
function VisionCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 md:p-12 text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
            <FiIcons.FiTarget className="w-8 h-8 opacity-50" />
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

    // Old format: "title - description" string
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
                <FiIcons.FiTarget className="w-8 h-8" />
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
          <MissionCardSkeleton count={missions.length || 4} />
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
                    <div className="text-primary-600">{mission.iconNode}</div>
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
