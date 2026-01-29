import { FiUser, FiUsers, FiSettings, FiShield } from "react-icons/fi";
import type { UserRole as PrismaUserRole } from "@prisma/client";
import { type UserRole as DomainUserRole } from "@/domain/enums";
import { formatEnumValue } from "@/presentation/services/user";

type RoleType = PrismaUserRole | DomainUserRole;

interface RoleProps {
  role: RoleType;
}

export default function Role({ role }: RoleProps) {
  // Get role badge class and icon
  const getRoleInfo = (role: RoleType) => {
    switch (role) {
      case "DPO":
        return {
          class: "bg-purple-100 text-purple-800",
          icon: <FiShield className="mr-1" />,
          text: formatEnumValue(role),
        };
      case "BPH":
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiSettings className="mr-1" />,
          text: formatEnumValue(role),
        };
      case "PENGURUS":
        return {
          class: "bg-indigo-100 text-indigo-800",
          icon: <FiUsers className="mr-1" />,
          text: formatEnumValue(role),
        };
      case "ANGGOTA":
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiUser className="mr-1" />,
          text: formatEnumValue(role),
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiUser className="mr-1" />,
          text: formatEnumValue(role),
        };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center w-fit ${roleInfo.class}`}
    >
      {roleInfo.icon}
      {roleInfo.text}
    </span>
  );
}
