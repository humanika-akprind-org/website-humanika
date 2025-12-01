interface DropdownMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  color?: "default" | "blue" | "red" | "green" | "orange";
}

export default function DropdownMenuItem({
  onClick,
  children,
  className = "",
  color = "default",
}: DropdownMenuItemProps) {
  const colorClasses = {
    default: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    blue: "text-blue-600 hover:bg-blue-50",
    red: "text-red-600 hover:bg-red-50",
    green: "text-green-600 hover:bg-green-50",
    orange: "text-orange-600 hover:bg-orange-50",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm flex items-center ${colorClasses[color]} ${className}`}
    >
      {children}
    </button>
  );
}
