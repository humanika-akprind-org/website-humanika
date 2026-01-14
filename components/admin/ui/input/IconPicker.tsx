"use client";

import { useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import * as FiIcons from "react-icons/fi";

// Get all available icons from react-icons/fi as options
const availableFiIcons = Object.keys(FiIcons).filter(
  (key) =>
    key.startsWith("Fi") &&
    typeof FiIcons[key as keyof typeof FiIcons] === "object"
);

export interface IconOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  options?: IconOption[];
  placeholder?: string;
  label?: string;
}

const defaultIcons: IconOption[] = [
  { value: "FiTarget", label: "Target", icon: FiIcons.FiTarget },
  { value: "FiStar", label: "Star", icon: FiIcons.FiStar },
  { value: "FiHeart", label: "Heart", icon: FiIcons.FiHeart },
  { value: "FiAward", label: "Award", icon: FiIcons.FiAward },
  { value: "FiTrendingUp", label: "Growth", icon: FiIcons.FiTrendingUp },
  { value: "FiZap", label: "Power", icon: FiIcons.FiZap },
  { value: "FiShield", label: "Protection", icon: FiIcons.FiShield },
  { value: "FiUsers", label: "Team", icon: FiIcons.FiUsers },
  { value: "FiGlobe", label: "Global", icon: FiIcons.FiGlobe },
  { value: "FiHome", label: "Home", icon: FiIcons.FiHome },
  { value: "FiBriefcase", label: "Business", icon: FiIcons.FiBriefcase },
  { value: "FiEye", label: "Idea", icon: FiIcons.FiEye },
  { value: "FiEye", label: "Vision", icon: FiIcons.FiEye },
  { value: "FiFlag", label: "Mission", icon: FiIcons.FiFlag },
  { value: "FiBookmark", label: "Bookmark", icon: FiIcons.FiBookmark },
  { value: "FiMapPin", label: "Location", icon: FiIcons.FiMapPin },
  { value: "FiPhone", label: "Phone", icon: FiIcons.FiPhone },
  { value: "FiMail", label: "Email", icon: FiIcons.FiMail },
  { value: "FiClock", label: "Time", icon: FiIcons.FiClock },
  { value: "FiCalendar", label: "Calendar", icon: FiIcons.FiCalendar },
];

export default function IconPicker({
  value,
  onChange,
  options = defaultIcons,
  placeholder = "Select icon",
  label = "Icon",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const SelectedIcon = selectedOption?.icon;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          {SelectedIcon ? (
            <SelectedIcon size={18} className="text-gray-600" />
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
          {SelectedIcon && (
            <span className="text-sm text-gray-700">
              {selectedOption?.label}
            </span>
          )}
        </div>
        <FiChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-2 py-1">
                {placeholder}
              </div>
              {options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <IconComponent
                      size={16}
                      className={isSelected ? "text-blue-600" : "text-gray-500"}
                    />
                    <span className="flex-1 text-left">{option.label}</span>
                    {isSelected && (
                      <FiCheck size={14} className="text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Export available icons for use in other components
export { defaultIcons, availableFiIcons };
