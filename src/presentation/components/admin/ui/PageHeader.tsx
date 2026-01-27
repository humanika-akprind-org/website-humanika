import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
}

export default function PageHeader({
  title,
  onBack,
  backHref,
}: PageHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      {(onBack || backHref) &&
        (backHref ? (
          <Link
            href={backHref}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </Link>
        ) : (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </button>
        ))}
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}
