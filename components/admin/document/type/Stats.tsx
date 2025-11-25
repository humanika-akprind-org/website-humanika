import { FiFolder, FiFileText } from "react-icons/fi";
import type { DocumentType } from "@/types/document-type";

interface DocumentTypeStatsProps {
  types: DocumentType[];
}

export default function DocumentTypeStats({ types }: DocumentTypeStatsProps) {
  const totalTypes = types.length;
  const typesWithDescription = types.filter((type) => type.description).length;

  const stats = [
    {
      name: "Total Types",
      value: totalTypes,
      icon: FiFolder,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "With Description",
      value: typesWithDescription,
      icon: FiFileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
