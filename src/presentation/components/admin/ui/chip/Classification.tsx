import { LetterClassification } from "@/types/enums";

interface ClassificationChipProps {
  classification: LetterClassification | string | null | undefined;
}

export default function ClassificationChip({
  classification,
}: ClassificationChipProps) {
  const getClassificationColor = (
    classification: LetterClassification | string | null | undefined,
  ) => {
    if (!classification) return "bg-gray-100 text-gray-800";

    switch (classification) {
      case LetterClassification.GENERAL:
        return "bg-green-100 text-green-800";
      case LetterClassification.CONFIDENTIAL:
        return "bg-orange-100 text-orange-800";
      case LetterClassification.HIGHLY_CONFIDENTIAL:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatClassification = (
    classification: LetterClassification | string | null | undefined,
  ) => {
    if (!classification) return "-";
    return classification
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getClassificationColor(
        classification,
      )}`}
    >
      {formatClassification(classification)}
    </span>
  );
}
