import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import DropdownMenuItem from "./DropdownMenuItem";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export default function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        title="More actions"
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export { DropdownMenuItem };
