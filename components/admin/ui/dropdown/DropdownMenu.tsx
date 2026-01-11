import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical } from "react-icons/fi";
import { Cross2Icon } from "@radix-ui/react-icons";
import DropdownMenuItem from "./DropdownMenuItem";

// Custom hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  boundaryRef?: React.RefObject<HTMLElement>;
  isLastItem?: boolean;
  hasMultipleItems?: boolean;
}

interface DropdownPosition {
  top: number;
  left: number;
}

export default function DropdownMenu({
  children,
  boundaryRef,
  isLastItem,
  hasMultipleItems,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        (!portalRef.current ||
          !portalRef.current.contains(event.target as Node))
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
      const windowWidth = window.innerWidth;
      const dropdownWidth = 192; // w-48 = 192px
      const dropdownHeight = 180; // Approximate height of dropdown
      const bottomMargin = 200; // Approximate height for pagination/footer
      const padding = 8; // Small padding from edges

      const spaceBelow = windowHeight - bottomMargin - rect.bottom;

      // Determine position: open upwards if only 1 item or if last item and has multiple items, otherwise downwards
      const shouldOpenUpwards =
        React.Children.count(children) === 1 ||
        (isLastItem && hasMultipleItems);

      // Calculate horizontal position (right-aligned with viewport)
      let left = windowWidth - dropdownWidth - padding;

      // Ensure it doesn't go off the left edge
      if (left < padding) {
        left = rect.right - dropdownWidth;
      }

      // Ensure dropdown doesn't go off the right edge
      if (left + dropdownWidth > windowWidth - padding) {
        left = windowWidth - dropdownWidth - padding;
      }

      // Calculate vertical position
      let top: number;
      if (shouldOpenUpwards) {
        // Position above the button
        top = rect.top - dropdownHeight - padding;
      } else {
        // Position below the button
        top = rect.bottom + padding;
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

      setDropdownPosition({ top, left });
    }
    setIsOpen(!isOpen);
  };

  // Check if we're in a browser environment for createPortal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle item click - close bottom sheet after action
  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  // Mobile bottom sheet content (using custom implementation to avoid Radix UI event issues)
  const bottomSheetContent =
    isOpen &&
    mounted &&
    createPortal(
      <>
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 z-[9999] bg-black/50 animate-in fade-in-0"
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: "auto" }}
        />
        {/* Bottom sheet content */}
        <div
          className="fixed bottom-0 left-0 right-0 z-[10000] bg-white rounded-t-xl p-4 pb-8 shadow-lg animate-in slide-in-from-bottom-0 duration-300"
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            pointerEvents: "auto",
          }}
          ref={portalRef}
        >
          {/* Drag indicator */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="space-y-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                const childOnClick = (child.props as any).onClick;
                return React.cloneElement(child as React.ReactElement<any>, {
                  onClick: () => handleItemClick(childOnClick),
                });
              }
              return child;
            })}
          </div>

          {/* Close button */}
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </>,
      document.body
    );

  // Desktop dropdown content
  const dropdownContent =
    isOpen &&
    mounted &&
    createPortal(
      <div
        className="fixed w-48 bg-white rounded-md shadow-lg z-[9999] border border-gray-200"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
        }}
        ref={portalRef}
      >
        <div className="py-1">{children}</div>
      </div>,
      document.body
    );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Show bottom sheet on mobile, dropdown on desktop */}
      {isMobile ? (
        <>
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="More actions"
          >
            <FiMoreVertical size={16} />
          </button>
          {bottomSheetContent}
        </>
      ) : (
        <>
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="More actions"
          >
            <FiMoreVertical size={16} />
          </button>
          {dropdownContent}
        </>
      )}
    </div>
  );
}

export { DropdownMenuItem };
