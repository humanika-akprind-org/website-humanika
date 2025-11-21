"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { OrganizationalStructure } from "@/types/structure";

// Helper function to validate image URL
const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return (
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
      url.includes("drive.google.com") ||
      url.startsWith("blob:")
    );
  } catch {
    return false;
  }
};

// Helper function to get preview URL from structure image (file ID or URL)
const getStructureImageUrl = (
  structureImage: string | null | undefined
): string => {
  if (!structureImage) return "";

  if (structureImage.includes("drive.google.com")) {
    const fileIdMatch = structureImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return structureImage;
  } else if (structureImage.match(/^[a-zA-Z0-9_-]+$/)) {
    return `https://drive.google.com/uc?export=view&id=${structureImage}`;
  } else {
    return structureImage;
  }
};

function OrganizationalStructureImage() {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await fetch("/api/structure?status=PUBLISH");
        if (response.ok) {
          const data = await response.json();
          setStructures(data || []);
        } else {
          setError("Failed to load organizational structure");
        }
      } catch (_err) {
        setError("Failed to load organizational structure");
      } finally {
        setLoading(false);
      }
    };

    fetchStructures();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/>
      </div>
    );
  }

  if (error || structures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500">
          {error || "No organizational structure available"}
        </p>
      </div>
    );
  }

  // Get the latest published structure
  const latestStructure = structures[0];
  const displayUrl = getStructureImageUrl(latestStructure.structure);

  return (
    <div className="flex items-center justify-center">
      {displayUrl && isValidImageUrl(displayUrl) ? (
        <div className="w-full max-w-4xl">
          <Image
            src={displayUrl}
            alt={`Struktur Organisasi ${latestStructure.name}`}
            width={800}
            height={600}
            className="w-full h-auto object-contain rounded-lg"
            onError={(e) => {
              console.error("Image failed to load:", displayUrl, e);
            }}
          />
        </div>
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 right-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Tentang HUMANIKA</h1>
            <p className="text-xl max-w-3xl">
              Himpunan Mahasiswa Informatika yang berdedikasi untuk
              mengembangkan potensi mahasiswa di bidang teknologi informasi.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Sejarah Kami</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 z-0 opacity-30" />
            </h2>
            <p className="text-gray-700 mb-4">
              HUMANIKA (Himpunan Mahasiswa Informatika) didirikan pada tahun
              2005 sebagai wadah bagi mahasiswa Program Studi Informatika untuk
              mengembangkan diri baik secara akademik maupun non-akademik.
            </p>
            <p className="text-gray-700 mb-6">
              Selama lebih dari 15 tahun, kami telah meluluskan ratusan anggota
              yang berkontribusi di berbagai bidang teknologi informasi, baik di
              industri maupun akademik.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Fakta Cepat
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    <strong>200+</strong> Anggota Aktif
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    <strong>50+</strong> Event Tahunan
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    <strong>30+</strong> Proyek Inovasi
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
              <span className="relative z-10">Visi & Misi</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-600 z-0 opacity-30" />
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Visi
                  </h3>
                  <p className="text-gray-700">
                    Menjadi himpunan mahasiswa informatika terdepan dalam
                    pengembangan teknologi dan karakter anggota yang berdaya
                    saing global.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Misi
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 pl-1">
                    <li>
                      Meningkatkan kompetensi teknis dan soft skill anggota
                      melalui berbagai program pengembangan
                    </li>
                    <li>
                      Membangun jaringan dengan industri, akademisi, dan
                      komunitas IT
                    </li>
                    <li>
                      Menyelenggarakan kegiatan yang mendukung pengembangan
                      akademik dan karakter
                    </li>
                    <li>
                      Berkontribusi pada pengembangan teknologi informasi di
                      masyarakat
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Struktur Organisasi
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <OrganizationalStructureImage />
          </div>
        </section>
      </main>
    </div>
  );
}
