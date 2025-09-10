// Generate random avatar color
const colors = [
  // Reds
  "#EF4444",
  "#DC2626",
  "#DB2777",
  "#EC4899",
  "#BE185D",
  // Oranges
  "#F97316",
  "#EA580C",
  "#D97706",
  "#C2410C",
  "#CA8A04",
  // Yellows
  "#F59E0B",
  "#EAB308",
  "#FACC15",
  "#FDE047",
  "#FEF08A",
  // Greens
  "#84CC16",
  "#65A30D",
  "#16A34A",
  "#10B981",
  "#059669",
  // Blues
  "#3B82F6",
  "#2563EB",
  "#1E40AF",
  "#0E7490",
  "#0891B2",
  // Purples
  "#8B5CF6",
  "#7C3AED",
  "#9333EA",
  // Magenta
  "#D946EF",
  "#C026D3",
  // Greys
  "#374151",
  "#4B5563",
];

export const randomColor = colors[Math.floor(Math.random() * colors.length)];
