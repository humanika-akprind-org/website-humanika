"use client";

export default function DevelopmentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center max-w-md mx-auto">
        <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-500 mb-2">
            Page Not Built Yet
          </h1>
          <p className="text-gray-400">
            This page has not been developed by the engineering team.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-yellow-700 text-sm">
              <span className="font-medium">Development Status:</span> This page
              is on the product roadmap but has not been scheduled for
              implementation.
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-400">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <span className="h-2 w-2 bg-gray-400 rounded-full mr-2" />
            STATUS: NOT STARTED
          </div>
        </div>
      </div>
    </div>
  );
}
