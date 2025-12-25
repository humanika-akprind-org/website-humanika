import { LetterPriority } from "@/types/enums";

interface PriorityChipProps {
  priority: LetterPriority;
}

export default function PriorityChip({ priority }: PriorityChipProps) {
  const getPriorityColor = (priority: LetterPriority) => {
    switch (priority) {
      case LetterPriority.IMPORTANT:
        return "bg-red-100 text-red-800";
      case LetterPriority.NORMAL:
        return "bg-green-100 text-green-800";
      case LetterPriority.URGENT:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(
        priority
      )}`}
    >
      {priority}
    </span>
  );
}
