import { motion } from "framer-motion";
import { type FAQItem as FAQItemType } from "../../../hooks/faq/constants";
import FAQItem from "./FAQItem";

interface FAQGridProps {
  filteredFaqs: FAQItemType[];
  expandedIndex: number | null;
  onToggleExpansion: (index: number) => void;
}

export default function FAQGrid({
  filteredFaqs,
  expandedIndex,
  onToggleExpansion,
}: FAQGridProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {filteredFaqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() => onToggleExpansion(index)}
          />
        ))}
      </motion.div>
    </div>
  );
}
