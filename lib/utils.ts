import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { getGoogleDrivePreviewUrl } from "@/lib/google-drive/file-utils";

// Helper function to get preview URL from image (file ID or URL)
export function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";
  return getGoogleDrivePreviewUrl(image);
}

// Helper function to format enum values for display
export const formatEnumValue = (value: string): string =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// utils/date.ts
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

// Format currency
export const formatCurrency = (amount: number) =>
  "Rp " +
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

// Parse currency string back to number
export const parseCurrency = (currencyString: string): number => {
  // Remove "Rp " and dots, replace comma with dot for decimal
  const cleaned = currencyString
    .replace(/Rp\s?/, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
};
