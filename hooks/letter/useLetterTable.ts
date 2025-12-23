import { useState } from "react";
import type { Letter } from "@/types/letter";

export function useLetterTable(letters: Letter[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  // Filter letters based on search term
  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.regarding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.destination.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Toggle letter selection
  const toggleLetterSelection = (id: string) => {
    setSelectedLetters((prev) =>
      prev.includes(id)
        ? prev.filter((letterId) => letterId !== id)
        : [...prev, id]
    );
  };

  // Select all letters
  const selectAllLetters = () => {
    if (selectedLetters.length === filteredLetters.length) {
      setSelectedLetters([]);
    } else {
      setSelectedLetters(filteredLetters.map((letter) => letter.id));
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedLetters([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedLetters,
    filteredLetters,
    toggleLetterSelection,
    selectAllLetters,
    clearSelection,
  };
}
