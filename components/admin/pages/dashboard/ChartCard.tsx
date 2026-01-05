// components/dashboard/ChartCard.tsx
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function ChartCard({
  title,
  children,
  icon,
  action,
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
