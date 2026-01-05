import { motion } from "framer-motion";
import { HelpCircle, ChevronRight } from "lucide-react";
import { type FAQItem as FAQItemType } from "../../../../hooks/faq/constants";

interface FAQItemProps {
  faq: FAQItemType;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function FAQItem({
  faq,
  index,
  isExpanded,
  onToggle,
}: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index % 6) }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-grey-200 cursor-pointer transition-all duration-300 ${
          isExpanded ? "ring-2 ring-primary-500" : ""
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-grey-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
              {faq.question}
            </h3>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-grey-700 leading-relaxed pt-2">{faq.answer}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-primary-600 font-medium">
                {isExpanded ? "Sembunyikan" : "Baca jawaban"}
              </span>
              <ChevronRight
                className={`w-5 h-5 text-grey-400 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
