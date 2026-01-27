import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

export type AlertType = "error" | "success" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  className?: string;
}

const alertStyles = {
  error: "bg-red-100 border-red-400 text-red-700",
  success: "bg-green-100 border-green-400 text-green-700",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  info: "bg-blue-100 border-blue-400 text-blue-700",
};

const alertIcons = {
  error: <FiAlertCircle className="text-red-500" />,
  success: <FiCheckCircle className="text-green-500" />,
  warning: <FiAlertTriangle className="text-yellow-500" />,
  info: <FiInfo className="text-blue-500" />,
};

export default function Alert({ type, message, className = "" }: AlertProps) {
  return (
    <div
      className={`border px-4 py-3 rounded mb-6 flex items-center ${alertStyles[type]} ${className}`}
    >
      <span className="mr-2">{alertIcons[type]}</span>
      {message}
    </div>
  );
}
