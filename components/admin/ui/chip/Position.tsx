import {
  FiStar,
  FiUser,
  FiSettings,
  FiBriefcase,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { Position } from "@/types/enums";
import { formatEnumValue } from "@/use-cases/api/user";

interface PositionProps {
  position?: Position | null;
}

export default function PositionChip({ position }: PositionProps) {
  // Get position badge class and icon
  const getPositionInfo = (position: Position) => {
    switch (position) {
      case Position.KETUA_UMUM:
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiStar className="mr-1" />,
          text: formatEnumValue(position),
        };
      case Position.WAKIL_KETUA_UMUM:
        return {
          class: "bg-pink-100 text-pink-800",
          icon: <FiSettings className="mr-1" />,
          text: formatEnumValue(position),
        };
      case Position.SEKRETARIS:
        return {
          class: "bg-purple-100 text-purple-800",
          icon: <FiBriefcase className="mr-1" />,
          text: formatEnumValue(position),
        };
      case Position.BENDAHARA:
        return {
          class: "bg-indigo-100 text-indigo-800",
          icon: <FiTrendingUp className="mr-1" />,
          text: formatEnumValue(position),
        };
      case Position.KEPALA_DEPARTEMEN:
        return {
          class: "bg-green-100 text-green-800",
          icon: <FiUser className="mr-1" />,
          text: formatEnumValue(position),
        };
      case Position.STAFF_DEPARTEMEN:
        return {
          class: "bg-yellow-100 text-yellow-800",
          icon: <FiUser className="mr-1" />,
          text: formatEnumValue(position),
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiX className="mr-1" />,
          text: formatEnumValue(position),
        };
    }
  };

  if (!position) {
    return <span className="text-sm text-gray-600">-</span>;
  }

  const positionInfo = getPositionInfo(position);

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center w-fit ${positionInfo.class}`}
    >
      {positionInfo.icon}
      {positionInfo.text}
    </span>
  );
}
