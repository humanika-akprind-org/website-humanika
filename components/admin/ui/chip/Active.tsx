import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface ActiveChipProps {
  isActive: boolean;
}

export default function ActiveChip({ isActive }: ActiveChipProps) {
  const getStatusInfo = (isActive: boolean) => {
    if (isActive) {
      return {
        class: "bg-green-100 text-green-800",
        icon: <FiCheckCircle className="mr-1" />,
        text: "Active",
      };
    } else {
      return {
        class: "bg-red-100 text-red-800",
        icon: <FiXCircle className="mr-1" />,
        text: "Deactive",
      };
    }
  };

  const statusInfo = getStatusInfo(isActive);

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center w-fit ${statusInfo.class}`}
    >
      {statusInfo.icon}
      {statusInfo.text}
    </span>
  );
}
