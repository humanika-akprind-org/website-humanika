"use client";

export default function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
    >
      Refresh
    </button>
  );
}
