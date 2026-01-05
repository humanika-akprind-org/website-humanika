import { ActivityType } from "@/types/enums";
import DateInput from "../../ui/date/DateInput";
import SelectInput from "../../ui/input/SelectInput";
import { Activity } from "lucide-react";

interface FiltersProps {
  filter: {
    activityType: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filter: {
    activityType: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function ActivityFilters({
  filter,
  onFilterChange,
}: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <SelectInput
        label="Activity Type"
        name="activityType"
        value={filter.activityType}
        onChange={(value) => onFilterChange({ ...filter, activityType: value })}
        options={[
          { value: "ALL", label: "All Activities" },
          ...Object.values(ActivityType).map((type) => ({
            value: type,
            label: type,
          })),
        ]}
        icon={<Activity className="h-4 w-4 text-gray-400" />}
      />

      <DateInput
        label="Start Date"
        value={filter.startDate}
        onChange={(value) => onFilterChange({ ...filter, startDate: value })}
      />

      <DateInput
        label="End Date"
        value={filter.endDate}
        onChange={(value) => onFilterChange({ ...filter, endDate: value })}
      />
    </div>
  );
}
