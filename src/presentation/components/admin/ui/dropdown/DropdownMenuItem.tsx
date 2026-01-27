interface DropdownMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  color?:
    | "default"
    | "blue"
    | "red"
    | "green"
    | "orange"
    | "purple"
    | "pink"
    | "yellow"
    | "indigo"
    | "teal"
    | "cyan"
    | "lime"
    | "amber"
    | "rose"
    | "violet"
    | "fuchsia"
    | "sky"
    | "emerald"
    | "slate"
    | "zinc";
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
    purple: "text-purple-600 hover:bg-purple-50",
    pink: "text-pink-600 hover:bg-pink-50",
    yellow: "text-yellow-600 hover:bg-yellow-50",
    indigo: "text-indigo-600 hover:bg-indigo-50",
    teal: "text-teal-600 hover:bg-teal-50",
    cyan: "text-cyan-600 hover:bg-cyan-50",
    lime: "text-lime-600 hover:bg-lime-50",
    amber: "text-amber-600 hover:bg-amber-50",
    rose: "text-rose-600 hover:bg-rose-50",
    violet: "text-violet-600 hover:bg-violet-50",
    fuchsia: "text-fuchsia-600 hover:bg-fuchsia-50",
    sky: "text-sky-600 hover:bg-sky-50",
    emerald: "text-emerald-600 hover:bg-emerald-50",
    slate: "text-slate-600 hover:bg-slate-50",
    zinc: "text-zinc-600 hover:bg-zinc-50",
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
