import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import { Status } from "@/types/enums";

interface StatusChipProps {
  status: Status;
}

export default function StatusChip({ status }: StatusChipProps) {
  // Get status badge class and icon
  const getStatusInfo = (status: Status) => {
    switch (status) {
      case Status.DRAFT:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiClock className="mr-1" />,
          text: "Draft",
        };
      case Status.PENDING:
        return {
          class: "bg-blue-100 text-blue-800",
          icon: <FiAlertCircle className="mr-1" />,
          text: "Pending",
        };
      case Status.PUBLISH:
        return {
          class: "bg-green-100 text-green-800",
          icon: <FiCheckCircle className="mr-1" />,
          text: "Published",
        };
      case Status.PRIVATE:
        return {
          class: "bg-yellow-100 text-yellow-800",
          icon: <FiEye className="mr-1" />,
          text: "Private",
        };
      case Status.ARCHIVE:
        return {
          class: "bg-red-100 text-red-800",
          icon: <FiXCircle className="mr-1" />,
          text: "Archived",
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800",
          icon: <FiClock className="mr-1" />,
          text: status,
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center w-fit ${statusInfo.class}`}
    >
      {statusInfo.icon}
      {statusInfo.text}
    </span>
  );
}
