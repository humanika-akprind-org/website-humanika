import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Letter } from "@/types/letter";
import { useToast } from "@/hooks/use-toast";

interface UseLetterManagementOptions {
  addPath?: string;
  editPath?: string;
}

export function useLetterManagement(options: UseLetterManagementOptions = {}) {
  const { addPath, editPath } = options;
  const router = useRouter();
  const { toast } = useToast();

  const [letters, setLetters] = useState<Letter[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const fetchLetters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/letter");
      if (response.ok) {
        const data = await response.json();
        setLetters(data || []);
        setFilteredLetters(data || []);
      } else {
        const errorMsg = "Failed to fetch letters";
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching letters:", error);
      const errorMsg = "Failed to fetch letters";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering and pagination
  const filteredLettersData = letters.filter((letter) => {
    const matchesSearch =
      letter.regarding
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      letter.origin.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      letter.destination
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      (letter.number &&
        letter.number
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || letter.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || letter.priority === priorityFilter;

    return matchesSearch && matchesType && matchesPriority;
  });

  useEffect(() => {
    setFilteredLetters(filteredLettersData);
    setTotalPages(Math.ceil(filteredLettersData.length / 10));
  }, [filteredLettersData, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial fetch
  useEffect(() => {
    fetchLetters();
  }, []);

  const toggleLetterSelection = (id: string) => {
    if (selectedLetters.includes(id)) {
      setSelectedLetters(selectedLetters.filter((letterId) => letterId !== id));
    } else {
      setSelectedLetters([...selectedLetters, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedLetters.length === filteredLetters.length) {
      setSelectedLetters([]);
    } else {
      setSelectedLetters(filteredLetters.map((letter) => letter.id));
    }
  };

  const handleAddLetter = () => {
    router.push(addPath || "/admin/administration/letters/add");
  };

  const handleEditLetter = (id: string) => {
    router.push(editPath || `/admin/administration/letters/edit/${id}`);
  };

  const handleViewLetter = (letter: Letter) => {
    setCurrentLetter(letter);
    setShowViewModal(true);
  };

  const handleDelete = (letter?: Letter) => {
    if (letter) {
      setCurrentLetter(letter);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentLetter) {
        const response = await fetch(`/api/letter/${currentLetter.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSuccess("Letter deleted successfully");
          toast({
            title: "Success",
            description: "Letter deleted successfully",
          });
          fetchLetters();
        } else {
          const errorMsg = "Failed to delete letter";
          setError(errorMsg);
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          });
        }
      } else if (selectedLetters.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        for (const letterId of selectedLetters) {
          try {
            const response = await fetch(`/api/letter/${letterId}`, {
              method: "DELETE",
            });
            if (response.ok) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch {
            errorCount++;
          }
        }

        setSelectedLetters([]);
        if (successCount > 0) {
          setSuccess(`${successCount} letters deleted successfully`);
          toast({
            title: "Success",
            description: `${successCount} letters deleted successfully`,
          });
        }
        if (errorCount > 0) {
          setError(`Failed to delete ${errorCount} letters`);
          toast({
            title: "Error",
            description: `Failed to delete ${errorCount} letters`,
            variant: "destructive",
          });
        }
        fetchLetters();
      }
    } catch (error) {
      console.error("Error deleting letter:", error);
      const errorMsg = "Failed to delete letter";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setShowDeleteModal(false);
      setCurrentLetter(null);
    }
  };

  return {
    letters: filteredLetters,
    loading,
    error,
    success,
    selectedLetters,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentLetter,
    typeFilter,
    priorityFilter,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentLetter,
    setTypeFilter,
    setPriorityFilter,
    toggleLetterSelection,
    toggleSelectAll,
    handleAddLetter,
    handleEditLetter,
    handleViewLetter,
    handleDelete,
    confirmDelete,
  };
}
