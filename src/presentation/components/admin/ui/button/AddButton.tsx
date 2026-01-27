import { FiPlus } from "react-icons/fi";
import { type ReactNode } from "react";

interface AddButtonProps {
  onClick: () => void;
  text?: string;
  icon?: ReactNode;
  className?: string;
}

export default function AddButton({
  onClick,
  text,
  icon = <FiPlus className="mr-2" />,
  className = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0",
}: AddButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {icon}
      {text}
    </button>
  );
}
