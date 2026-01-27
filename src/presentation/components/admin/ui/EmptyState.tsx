interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionButton,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-2">{icon}</div>
      <p className="text-gray-500 text-lg font-medium">{title}</p>
      <p className="text-gray-400 mt-1">{description}</p>
      {actionButton && (
        <div className="flex justify-center mt-4">{actionButton}</div>
      )}
    </div>
  );
}
