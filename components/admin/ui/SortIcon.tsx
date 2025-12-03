import { FiArrowUp, FiArrowDown } from "react-icons/fi";

interface SortIconProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  field: string;
  iconType?: "text" | "arrow";
}

export default function SortIcon({
  sortField,
  sortDirection,
  field,
  iconType = "text",
}: SortIconProps) {
  if (sortField !== field) return null;

  if (iconType === "arrow") {
    return sortDirection === "asc" ? (
      <FiArrowUp size={14} />
    ) : (
      <FiArrowDown size={14} />
    );
  }

  return sortDirection === "asc" ? "↑" : "↓";
}
