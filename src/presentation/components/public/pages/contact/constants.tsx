import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient: string;
}

export interface SocialMedia {
  name: string;
  icon: React.ReactNode;
  url: string;
}

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Telepon",
    value: "+62 812-3456-7890",
    gradient: "bg-blue-500",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    value: "humanika@akprind.ac.id",
    gradient: "bg-purple-500",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Alamat",
    value: "Jl. Kalisahak No.28, Klitren, Yogyakarta",
    gradient: "bg-green-500",
  },
];

export const SOCIAL_MEDIA: SocialMedia[] = [
  {
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    url: "https://www.facebook.com/share/1BSXSNnrgp/",
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://www.instagram.com/humanika_akprind?igsh=d2E4bW5oOTVoaDlt",
  },
  {
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    url: "https://x.com/HumanikaAKPRIND?t=eneYcjEgcmP0k6mNhKWm1w&s=09",
  },
  {
    name: "YouTube",
    icon: <Youtube className="w-5 h-5" />,
    url: "https://youtube.com/@humanika.akprind1991?si=JZE3TaAS-lfM3uMD",
  },
];
