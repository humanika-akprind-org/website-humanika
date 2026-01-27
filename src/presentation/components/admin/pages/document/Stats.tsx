"use client";

import {
  FiFileText,
  FiCheckCircle,
  FiTrendingUp,
  FiArchive,
} from "react-icons/fi";
import type { Document } from "@/domain/entities/document.entity";
import { Status } from "@/domain/enums/enums";
import StatCard from "../../ui/card/StatCard";

interface StatsProps {
  documents: Document[];
  typeFilter?: string;
  excludeTypes?: string[];
}

export default function Stats({
  documents,
  typeFilter,
  excludeTypes = [],
}: StatsProps) {
  const filteredDocuments = documents.filter((doc) => {
    const matchesType =
      !typeFilter ||
      doc.documentType?.name?.toLowerCase().replace(/[\s\-]/g, "") ===
        typeFilter.toLowerCase().replace(/[\s\-]/g, "");

    // Normalize document type name for exclusion check
    const normalizedDocTypeName = doc.documentType?.name
      ?.toLowerCase()
      .replace(/[\s\-]/g, "");
    const normalizedDocType = doc.type
      ? doc.type.toLowerCase().replace(/[\s\-]/g, "")
      : "";

    const notExcluded = !excludeTypes.some(
      (excludeType: string) =>
        excludeType === normalizedDocTypeName ||
        excludeType === normalizedDocType,
    );

    return matchesType && notExcluded;
  });

  const stats = [
    {
      title: "Total Documents",
      value: filteredDocuments.length,
      icon: FiFileText,
      color: "blue",
    },
    {
      title: "Published",
      value: filteredDocuments.filter((doc) => doc.status === Status.PUBLISH)
        .length,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Drafts",
      value: filteredDocuments.filter((doc) => doc.status === Status.DRAFT)
        .length,
      icon: FiTrendingUp,
      color: "yellow",
    },
    {
      title: "Archived",
      value: filteredDocuments.filter((doc) => doc.status === Status.ARCHIVE)
        .length,
      icon: FiArchive,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
