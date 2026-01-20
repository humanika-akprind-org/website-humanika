/**
 * Document Utilities
 * Centralized utilities for handling document form helpers
 */

/**
 * Dynamic label based on fixedDocumentType
 * @param type - Fixed document type (e.g., "proposal", "accountability report")
 * @returns Dynamic label string
 */
export const getDynamicLabel = (type?: string): string => {
  if (!type) return "Document Name";
  if (type.toLowerCase() === "proposal") return "Proposal Name";
  if (type.toLowerCase().replace(/[\s\-]/g, "") === "accountabilityreport") {
    return "Accountability Report Name";
  }
  return "Document Name";
};

/**
 * Dynamic placeholder based on fixedDocumentType
 * @param type - Fixed document type (e.g., "proposal", "accountability report")
 * @returns Dynamic placeholder string
 */
export const getDynamicPlaceholder = (type?: string): string => {
  if (!type) return "Enter document name";
  if (type.toLowerCase() === "proposal") return "Enter proposal name";
  if (type.toLowerCase().replace(/[\s\-]/g, "") === "accountabilityreport") {
    return "Enter accountability report name";
  }
  return "Enter document name";
};
