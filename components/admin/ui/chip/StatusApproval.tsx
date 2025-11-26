import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface StatusApprovalProps {
  status: string;
}

export default function StatusApproval({ status }: StatusApprovalProps) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
        status === "APPROVED"
          ? "bg-green-100 text-green-800"
          : status === "REJECTED"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status === "APPROVED" && <FiCheckCircle className="mr-1" />}
      {status === "REJECTED" && <FiXCircle className="mr-1" />}
      {status === "PENDING" && <FiClock className="mr-1" />}
      {status}
    </span>
  );
}
