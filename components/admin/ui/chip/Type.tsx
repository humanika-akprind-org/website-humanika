import { LetterType } from "@/types/enums";

interface TypeChipProps {
  type: LetterType;
}

export default function TypeChip({ type }: TypeChipProps) {
  const getTypeColor = (type: LetterType) => {
    switch (type) {
      case LetterType.INCOMING:
        return "bg-blue-100 text-blue-800";
      case LetterType.OUTGOING:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(
        type
      )}`}
    >
      {type}
    </span>
  );
}
