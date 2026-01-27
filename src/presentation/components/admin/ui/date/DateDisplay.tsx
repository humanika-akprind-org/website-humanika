interface DateDisplayProps {
  date: Date | string;
}

export default function DateDisplay({ date }: DateDisplayProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return <span>{formatDate(date)}</span>;
}
