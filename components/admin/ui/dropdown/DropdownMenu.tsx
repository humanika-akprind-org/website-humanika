import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import DropdownMenuItem from "./DropdownMenuItem";

interface DropdownMenuProps {
  children: React.ReactNode;
  boundaryRef?: React.RefObject<HTMLElement>;
  isLastItem?: boolean;
  hasMultipleItems?: boolean;
  itemCount?: number;
}

export default function DropdownMenu({
  children,
  boundaryRef,
  isLastItem,
  hasMultipleItems,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = 200; // Approximate height of dropdown
      const bottomMargin = 200; // Approximate height for pagination/footer

      const spaceBelow = windowHeight - bottomMargin - rect.bottom;
      const itemCount = React.Children.count(children);

      // Determine position: open upwards if only 1 item or if last item and has multiple items, otherwise downwards
      if (itemCount === 1 || (isLastItem && hasMultipleItems)) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }

      // If opening and boundaryRef provided, and space below is insufficient (cut off by pagination), increase row height
      if (!isOpen && boundaryRef?.current && spaceBelow < dropdownHeight) {
        boundaryRef.current.style.minHeight = `${
          dropdownHeight + rect.height
        }px`;
      }

      // If closing, reset row height
      if (isOpen && boundaryRef?.current) {
        boundaryRef.current.style.minHeight = "";
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        title="More actions"
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 w-48 bg-white rounded-md shadow-lg z-[9999] border border-gray-200 ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export { DropdownMenuItem };
