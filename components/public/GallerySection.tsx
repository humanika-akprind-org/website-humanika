"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LatestGalleryGrid from "./gallery/LatestGalleryGrid";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Gallery } from "@/types/gallery";

export default function GallerySection() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGalleries() {
      try {
        setLoading(true);
        const galleriesData = await getGalleries();
        setGalleries(galleriesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load gallery data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadGalleries();
  }, []);

  if (loading) return <div>Loading galleries...</div>;
  if (error) return <div>Error loading galleries: {error}</div>;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 text-grey-900 mb-4">Galeri Kegiatan</h2>
          <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
            Dokumentasi momen berharga dari berbagai kegiatan dan acara HUMANIKA
          </p>
        </div>

        {/* Gallery Grid Component */}
        <div className="mb-12">
          <LatestGalleryGrid galleries={galleries.slice(0, 9)} />
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center px-6 py-3 bg-white border border-grey-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            Lihat Galeri Lengkap
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
