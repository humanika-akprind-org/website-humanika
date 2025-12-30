import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredFaqsCount: number;
}

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  filteredFaqsCount,
}: SearchSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-4xl mx-auto mb-12"
    >
      <div className="relative">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari pertanyaan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl border border-grey-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-grey-400 hover:text-grey-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {searchTerm && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-grey-600"
        >
          Ditemukan {filteredFaqsCount} pertanyaan untuk "{searchTerm}"
        </motion.p>
      )}
    </motion.div>
  );
}
