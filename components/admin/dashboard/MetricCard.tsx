import { Icons } from "@/components/icons";

interface MetricCardProps {
  icon: keyof typeof Icons;
  color: string;
  value: string | number;
  title: string;
  statusIcon: keyof typeof Icons;
  statusColor: string;
  statusText: string;
  fontMedium?: boolean;
  valueSize?: "lg" | "2xl";
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
}: MetricCardProps) {
  const IconComponent = Icons[icon];
  const StatusIconComponent = Icons[statusIcon];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <IconComponent className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="text-right">
          <p className={`text-${valueSize} font-bold text-${color}-600`}>
            {value}
          </p>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>
      <div className="flex items-center text-sm">
        <StatusIconComponent className={`h-4 w-4 text-${statusColor} mr-1`} />
        <span
          className={`text-${statusColor} ${fontMedium ? "font-medium" : ""}`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}
