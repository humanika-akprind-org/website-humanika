"use client";

import "@/app/not-found.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const floatingElements = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 8 + 12,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden relative">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((item) => (
          <div
            key={item.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-100/20 to-purple-100/20 animate-float"
            style={{
              width: `${item.size}px`,
              height: `${item.size}px`,
              left: `${item.left}%`,
              top: "-50px",
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div
          className={`bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all duration-700 ${
            isMounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Logo Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-20" />
            <div className="relative mx-auto w-24 h-24">
              <Image
                src="/logo.png"
                alt="HUMANIKA"
                width={94}
                height={94}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Error Number with Animation */}
          <div className="mb-4">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              404
            </h1>
          </div>

          <h2 className="text-2xl font-bold mb-3 text-gray-800 animate-slide-up">
            Oops! Page Not Found
          </h2>

          <p
            className="text-gray-600 mb-8 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            The page you&apos;re looking for seems to have vanished into the
            digital void.
          </p>

          {/* Animated Button */}
          <div
            className="space-y-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              onClick={() => router.back()}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 w-full"
            >
              <span className="relative z-10">Go Back</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={() => router.push("/")}
              className="group px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-full font-semibold transition-all duration-300 hover:bg-blue-50 hover:border-blue-600 hover:scale-105 w-full"
            >
              Go Home
            </button>
          </div>

          {/* Search suggestion */}
          <div
            className="mt-8 pt-6 border-t border-gray-100 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-sm text-gray-500 mb-2">
              Can&apos;t find what you need?
            </p>
            <button
              onClick={() => router.push("/search")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Try our search →
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400 animate-pulse">
            <span className="text-sm">Need help?</span>
            <button
              onClick={() => router.push("/contact")}
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
