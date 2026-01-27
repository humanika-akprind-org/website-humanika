import { Filter } from "lucide-react";

// components/dashboard/TimeFilter.tsx
interface TimeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimeFilter({ value, onChange }: TimeFilterProps) {
  const options = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Quarter", value: "quarter" },
    { label: "Year", value: "year" },
  ];

  return (
    <div className="flex items-center bg-white rounded-lg border overflow-hidden">
      <Filter className="w-4 h-4 text-gray-400 ml-3" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-2 pr-4 py-2 bg-transparent text-sm border-none focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
