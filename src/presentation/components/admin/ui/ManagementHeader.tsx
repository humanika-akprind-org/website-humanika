interface ManagementHeaderProps {
  title?: string;
  description?: string;
}

export default function ManagementHeader({
  title,
  description,
}: ManagementHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}
