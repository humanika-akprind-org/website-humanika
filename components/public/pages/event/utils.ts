import type { Event } from "@/types/event";
import type { EventCategory } from "@/types/event-category";

export function truncateDescription(
  description: string | undefined,
  maxLength: number = 150
): string {
  if (!description) return "";
  return description.length > maxLength
    ? `${description.substring(0, maxLength)}...`
    : description;
}

export function generateCategories(
  eventCategories: EventCategory[],
  allEvents: Event[]
) {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-cyan-500 to-cyan-600",
    "from-red-500 to-red-600",
    "from-yellow-500 to-yellow-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
  ];

  return [
    {
      id: "all",
      name: "Semua Kategori",
      count: allEvents.length,
      color: "from-grey-500 to-grey-600",
    },
    ...eventCategories.map((category, index) => ({
      id: category.name.toLowerCase().replace(/\s+/g, "-"),
      name: category.name,
      count: allEvents.filter((e) => e.category?.id === category.id).length,
      color: colors[index % colors.length],
    })),
  ];
}

export function hasActiveFilters(filters: {
  searchQuery: string;
  selectedCategory: string;
  selectedType: string;
  selectedStatus: string;
}): boolean {
  return !!(
    filters.searchQuery ||
    filters.selectedCategory !== "all" ||
    filters.selectedType !== "all" ||
    filters.selectedStatus !== "all"
  );
}
