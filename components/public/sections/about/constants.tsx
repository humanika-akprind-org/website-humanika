import {
  Users,
  Calendar,
  Code,
  Award,
  TrendingUp,
  BookOpen,
  Heart,
  Globe,
  Lightbulb,
  Target,
  GraduationCap,
  Briefcase,
  History,
} from "lucide-react";

export const STATS_DATA = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "200+",
    label: "Anggota Aktif",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    value: "50+",
    label: "Event Tahunan",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Code className="w-6 h-6" />,
    value: "30+",
    label: "Proyek Inovasi",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <Award className="w-6 h-6" />,
    value: "15+",
    label: "Penghargaan",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "95%",
    label: "Kepuasan Anggota",
    color: "from-red-500 to-red-600",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    value: "100+",
    label: "Materi Pembelajaran",
    color: "from-cyan-500 to-cyan-600",
  },
];

export const MILESTONES_DATA = [
  {
    year: "2005",
    title: "Pendirian",
    description: "HUMANIKA didirikan sebagai wadah mahasiswa informatika",
  },
  {
    year: "2010",
    title: "Ekspansi",
    description: "Memperluas jaringan dengan industri dan komunitas",
  },
  {
    year: "2015",
    title: "Digitalisasi",
    description: "Transformasi digital dan pengembangan platform online",
  },
  {
    year: "2020",
    title: "Inovasi",
    description: "Fokus pada proyek teknologi berdampak sosial",
  },
  {
    year: "2024",
    title: "Globalisasi",
    description: "Kolaborasi internasional dan standar global",
  },
];

export const VALUES_DATA = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Kolaborasi",
    description:
      "Kami percaya kekuatan terbesar berasal dari kerja sama dan saling mendukung dalam tim.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Inovasi",
    description:
      "Terus mendorong batas kreativitas untuk menciptakan solusi teknologi yang berdampak.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Integritas",
    description:
      "Bertindak dengan jujur, transparan, dan bertanggung jawab dalam setiap langkah.",
    color: "from-blue-500 to-blue-600",
  },
];

export const MISSIONS_DATA = [
  {
    number: "01",
    title: "Pengembangan Kompetensi",
    description:
      "Meningkatkan keterampilan teknis dan soft skills melalui program pelatihan terstruktur.",
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    number: "02",
    title: "Jaringan Industri",
    description:
      "Membangun dan memperkuat kolaborasi dengan perusahaan teknologi terkemuka.",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    number: "03",
    title: "Inovasi Teknologi",
    description:
      "Mendorong penelitian dan pengembangan solusi teknologi yang berdampak sosial.",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    number: "04",
    title: "Kontribusi Sosial",
    description:
      "Menerapkan teknologi untuk memecahkan masalah nyata dalam masyarakat.",
    icon: <Heart className="w-6 h-6" />,
  },
];

export const GOALS_DATA = [
  { goal: "500+ Anggota Aktif", progress: 80 },
  { goal: "100+ Proyek Inovasi", progress: 65 },
  { goal: "50+ Partner Industri", progress: 70 },
  { goal: "10+ Penghargaan Nasional", progress: 90 },
];

export const ACHIEVEMENTS_DATA = [
  {
    year: "2023",
    achievement: "Juara 1 Nasional Hackathon AI",
    category: "Kompetisi",
  },
  {
    year: "2022",
    achievement: "Partner Google Developer Student Clubs",
    category: "Kolaborasi",
  },
  {
    year: "2021",
    achievement: "Best Student Organization Award",
    category: "Penghargaan",
  },
  {
    year: "2020",
    achievement: "Launching Platform E-Learning",
    category: "Inovasi",
  },
  {
    year: "2019",
    achievement: "500+ Alumni Berkarir di Tech Giant",
    category: "Karir",
  },
  {
    year: "2018",
    achievement: "International Research Publication",
    category: "Riset",
  },
];

export const FEATURES_DATA = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Pendidikan",
    description: "Program pembelajaran dan workshop",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Karir",
    description: "Kesempatan magang dan jaringan industri",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Proyek",
    description: "Pengembangan solusi teknologi nyata",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Komunitas",
    description: "Jaringan alumni dan profesional",
  },
];

export const NAVIGATION_TABS = [
  {
    id: "about",
    label: "Tentang Kami",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "vision",
    label: "Visi & Misi",
    icon: <Target className="w-4 h-4" />,
  },
  {
    id: "history",
    label: "Sejarah",
    icon: <History className="w-4 h-4" />,
  },
] as const;

export type TabType = (typeof NAVIGATION_TABS)[number]["id"];
