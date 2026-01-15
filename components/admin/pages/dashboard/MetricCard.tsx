import Link from "next/link";
import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";

interface MetricCardProps {
  icon: string;
  color: string;
  value: string | number;
  title: string;
  statusIcon: string;
  statusColor: string;
  statusText: string;
  fontMedium?: boolean;
  valueSize?: "lg" | "2xl";
  href?: string;
}

// Map icon names from page.tsx to actual Lucide component names
const iconNameMap: Record<string, string> = {
  // Status icons
  close: "X",
  image: "ImageIcon",
  users: "Users",
  trendingUp: "TrendingUp",
  checkCircle: "CheckCircle",
  // Main icons
  dollarSign: "DollarSign",
  newspaper: "Newspaper",
  calendar: "Calendar",
};

function getIconComponent(
  iconName: string
): ComponentType<{ className?: string }> | undefined {
  // First check the custom map
  const mappedName = iconNameMap[iconName];
  const componentName =
    mappedName || iconName.charAt(0).toUpperCase() + iconName.slice(1);
  return LucideIcons[componentName as keyof typeof LucideIcons] as
    | ComponentType<{ className?: string }>
    | undefined;
}

export function MetricCard({
  icon,
  color,
  value,
  title,
  statusIcon,
  statusColor,
  statusText,
  fontMedium = false,
  valueSize = "2xl",
  href,
}: MetricCardProps) {
  const IconComponent = getIconComponent(icon);
  const StatusIconComponent = getIconComponent(statusIcon);

  const cardContent = (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
        href ? "hover:shadow-md transition-shadow cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          {IconComponent && (
            <IconComponent className={`h-6 w-6 text-${color}-600`} />
          )}
        </div>
        <div className="text-right">
          <p className={`text-${valueSize} font-bold text-${color}-600`}>
            {value}
          </p>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>
      <div className="flex items-center text-sm">
        {StatusIconComponent && (
          <StatusIconComponent className={`h-4 w-4 text-${statusColor} mr-1`} />
        )}
        <span
          className={`text-${statusColor} ${fontMedium ? "font-medium" : ""}`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
