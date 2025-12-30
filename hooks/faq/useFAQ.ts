import { useState, useMemo } from "react";
import { faqs } from "./constants";

export const useFAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqs;

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerSearchTerm) ||
        faq.answer.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);

  const toggleExpansion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const clearSearch = () => setSearchTerm("");

  return {
    searchTerm,
    setSearchTerm,
    expandedIndex,
    filteredFaqs,
    toggleExpansion,
    clearSearch,
  };
};
