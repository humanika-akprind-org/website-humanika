export default function TechCard({
  title,
  description,
  icon,
  color = "blue",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: "blue" | "red" | "yellow";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  const borderClasses = {
    blue: "border-blue-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${borderClasses[color]} hover:shadow-lg transition-shadow`}
    >
      <div
        className={`${colorClasses[color]} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
