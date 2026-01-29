import {
  FiX,
  FiUsers,
  FiSettings,
  FiMonitor,
  FiBriefcase,
  FiTrendingUp,
} from "react-icons/fi";
import type { Department as PrismaDepartment } from "@prisma/client";
import { type Department as DomainDepartment } from "@/domain/enums";
import { formatEnumValue } from "@/presentation/services/user";

type DepartmentType = PrismaDepartment | DomainDepartment;

interface DepartmentProps {
  department?: DepartmentType | null;
}

export default function DepartmentChip({ department }: DepartmentProps) {
  // Get department badge class and icon
  const getDepartmentInfo = (department: DepartmentType) => {
    switch (department) {
      case "BPH":
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiSettings className="mr-1" />,
          text: formatEnumValue(department),
        };
      case "INFOKOM":
        return {
          class: "bg-pink-100 text-pink-800",
          icon: <FiMonitor className="mr-1" />,
          text: formatEnumValue(department),
        };
      case "PSDM":
        return {
          class: "bg-purple-100 text-purple-800",
          icon: <FiUsers className="mr-1" />,
          text: formatEnumValue(department),
        };
      case "LITBANG":
        return {
          class: "bg-indigo-100 text-indigo-800",
          icon: <FiBriefcase className="mr-1" />,
          text: formatEnumValue(department),
        };
      case "KWU":
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
