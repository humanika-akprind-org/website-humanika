"use client";

import "@/app/error.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);

  useEffect(() => {
    setIsVisible(true);

    // Create particles for error effect
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
    }));
    setParticles(newParticles);

    // Trigger shake animation
    setTimeout(() => setShake(true), 300);
    setTimeout(() => setShake(false), 800);
  }, []);

  const errorDetails = error?.digest ? `Error ID: ${error.digest}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="100" height="100" fill="none" />
                <path
                  d="M20,20 L80,20 M80,20 L80,80 M80,80 L20,80 M20,80 L20,20"
                  stroke="#dc2626"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="20" cy="20" r="3" fill="#dc2626" />
                <circle cx="80" cy="20" r="3" fill="#dc2626" />
                <circle cx="80" cy="80" r="3" fill="#dc2626" />
                <circle cx="20" cy="80" r="3" fill="#dc2626" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Floating Error Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-red-200/50 to-orange-200/50 animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div
          className={`w-full max-w-2xl transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Error Header with Logo */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              {/* Broken Logo Effect */}
              <div className={`relative ${shake ? "animate-shake" : ""}`}>
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse-slow" />
                <div className="relative flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src="/logo.png"
                      alt="HUMANIKA"
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white shadow-2xl"
                    />
                    {/* Crack Effect */}
                    <div className="absolute inset-0">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        className="animate-pulse"
                      >
                        <path
                          d="M40,20 L40,60"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="4"
                          opacity="0.6"
                        />
                        <path
                          d="M20,40 L60,40"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="4"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Title */}
            <h1 className="mt-8 text-6xl font-bold text-center">
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent animate-gradient">
                ERROR
              </span>
            </h1>
            <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
          </div>

          {/* Error Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-red-100 animate-zoom-in">
            {/* Error Status Bar */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-white font-semibold">System Error</span>
                </div>
                <div className="text-white/80 text-sm">
                  {errorDetails && (
                    <span className="font-mono">{errorDetails}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="p-8">
              <div className="flex items-start space-x-4">
                {/* Error Icon */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping-slow" />
                  </div>
                </div>

                {/* Error Message */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Something went wrong in the admin panel
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-700 font-mono text-sm break-all">
                        {error?.message ||
                          "An unexpected error occurred. Please try again."}
                      </p>
                    </div>
                  </div>

                  {/* Error Details (Collapsible) */}
                  {error.stack && (
                    <details className="mb-6">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium mb-2">
                        Technical Details
                      </summary>
                      <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 overflow-auto max-h-40">
                        <pre>{error.stack}</pre>
                      </div>
                    </details>
                  )}

                  {/* Action Buttons */}
                  <div
                    className="flex flex-col sm:flex-row gap-4 animate-slide-up"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <button
                      onClick={reset}
                      className="group relative flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                      type="button"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Try Again
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <button
                      onClick={() => router.back()}
                      className="group flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02]"
                    >
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Go Back
                      </span>
                    </button>

                    <button
                      onClick={() => router.push("/")}
                      className="group flex-1 px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-50 hover:scale-[1.02]"
                    >
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Home
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="border-t border-gray-100 p-6 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Need immediate assistance?
                </div>
                <button
                  onClick={() => router.push("/contact")}
                  className="group px-5 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <span className="flex items-center">
                    Contact Support
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
              <span className="font-mono">Status: 500</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>Time: {new Date().toLocaleTimeString()}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>Admin Panel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}