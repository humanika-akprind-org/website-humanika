import { FiFolder, FiFileText } from "react-icons/fi";
import type { DocumentType } from "@/types/document-type";
import StatCard from "../../../ui/card/StatCard";

interface DocumentTypeStatsProps {
  types: DocumentType[];
}

export default function DocumentTypeStats({ types }: DocumentTypeStatsProps) {
  const stats = [
    {
      title: "Total Types",
      value: types.length,
      icon: FiFolder,
      color: "blue",
    },
    {
      title: "With Description",
      value: types.filter((type) => type.description).length,
      icon: FiFileText,
      color: "green",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
