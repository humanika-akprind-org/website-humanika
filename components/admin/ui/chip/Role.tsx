import { FiUser, FiUsers, FiSettings, FiShield } from "react-icons/fi";
import { UserRole } from "@/types/enums";
import { formatEnumValue } from "@/use-cases/api/user";

interface RoleProps {
  role: UserRole;
}

export default function Role({ role }: RoleProps) {
  // Get role badge class and icon
  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case UserRole.DPO:
        return {
          class: "bg-purple-100 text-purple-800",
          icon: <FiShield className="mr-1" />,
          text: formatEnumValue(role),
        };
      case UserRole.BPH:
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiSettings className="mr-1" />,
          text: formatEnumValue(role),
        };
      case UserRole.PENGURUS:
        return {
          class: "bg-indigo-100 text-indigo-800",
          icon: <FiUsers className="mr-1" />,
          text: formatEnumValue(role),
        };
      case UserRole.ANGGOTA:
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
