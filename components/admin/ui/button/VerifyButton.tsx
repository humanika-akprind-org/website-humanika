import { FiCheckCircle } from "react-icons/fi";

interface VerifyButtonProps {
  onClick: () => void;
  selectedCount: number;
  disabled?: boolean;
  className?: string;
}

export default function VerifyButton({
  onClick,
  selectedCount,
  disabled = false,
  className = "px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center disabled:opacity-50",
}: VerifyButtonProps) {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      <FiCheckCircle className="mr-2" />
      Verify Accounts ({selectedCount})
    </button>
  );
}
