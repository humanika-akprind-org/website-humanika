"use client";

import { useState, useRef, useEffect } from "react";
import { LogoutButton } from "@/components/public/LogoutButton";

interface User {
  name: string;
  role: string;
  avatarColor?: string;
}

interface UserDropdownProps {
  currentUser: User;
}

// Helper function to get user initials
const getUserInitials = (name: string): string =>
  name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

export function UserDropdown({ currentUser }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 bg-blue-700/30 py-2 px-4 rounded-full border border-blue-500/50 hover:bg-blue-700/50 transition-colors duration-200 cursor-pointer"
      >
        {/* User Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: currentUser.avatarColor || '#3B82F6' }}
        >
          {getUserInitials(currentUser.name)}
        </div>

        <div className="text-right min-w-[120px] max-w-[200px]">
          <p className="font-medium truncate" title={currentUser.name}>
            {currentUser.name}
          </p>
          <p className="text-blue-200 text-xs bg-blue-900/40 px-2 py-1 rounded-full mt-1 inline-block">
            {currentUser.role}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base"
                style={{ backgroundColor: currentUser.avatarColor || '#3B82F6' }}
              >
                {getUserInitials(currentUser.name)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150">
              Profile Settings
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150">
              Account Settings
            </button>
            <hr className="border-t border-gray-200 my-1" />
            <div className="px-4 py-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
