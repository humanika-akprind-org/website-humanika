"use client";

import React from "react";

interface CancelButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  disabled = false,
  children = "Batal",
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export default CancelButton;
