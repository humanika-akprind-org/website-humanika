import { FiSave } from "react-icons/fi";

interface SubmitButtonProps {
  isSubmitting: boolean;
  text: string;
  loadingText: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function SubmitButton({
  isSubmitting,
  text,
  loadingText,
  icon = <FiSave className="mr-2" />,
  className = "px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50",
}: SubmitButtonProps) {
  return (
    <button type="submit" disabled={isSubmitting} className={className}>
      {icon}
      {isSubmitting ? loadingText : text}
    </button>
  );
}
