import {
  FiX,
  FiUsers,
  FiSettings,
  FiMonitor,
  FiBriefcase,
  FiTrendingUp,
} from "react-icons/fi";
import { Department } from "@/types/enums";
import { formatEnumValue } from "@/use-cases/api/user";

interface DepartmentProps {
  department?: Department | null;
}

export default function DepartmentChip({ department }: DepartmentProps) {
  // Get department badge class and icon
  const getDepartmentInfo = (department: Department) => {
    switch (department) {
      case Department.BPH:
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiSettings className="mr-1" />,
          text: formatEnumValue(department),
        };
      case Department.INFOKOM:
        return {
          class: "bg-pink-100 text-pink-800",
          icon: <FiMonitor className="mr-1" />,
          text: formatEnumValue(department),
        };
      case Department.PSDM:
        return {
          class: "bg-purple-100 text-purple-800",
          icon: <FiUsers className="mr-1" />,
          text: formatEnumValue(department),
        };
      case Department.LITBANG:
        return {
          class: "bg-indigo-100 text-indigo-800",
          icon: <FiBriefcase className="mr-1" />,
          text: formatEnumValue(department),
        };
      case Department.KWU:
        return {
          class: "bg-green-100 text-green-800",
          icon: <FiTrendingUp className="mr-1" />,
          text: formatEnumValue(department),
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiX className="mr-1" />,
          text: formatEnumValue(department),
        };
    }
  };

  if (!department) {
    return <span className="text-sm text-gray-600">-</span>;
  }

  const departmentInfo = getDepartmentInfo(department);

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center w-fit ${departmentInfo.class}`}
    >
      {departmentInfo.icon}
      {departmentInfo.text}
    </span>
  );
}
