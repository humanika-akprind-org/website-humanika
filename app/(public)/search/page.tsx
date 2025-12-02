"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";

interface SearchResult {
  type: "article" | "event" | "gallery";
  id: string;
  title: string;
  description?: string;
  content?: string;
  date?: string;
  image?: string;
  url: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: type,
        limit: "50",
      });

      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data: SearchResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    const initialType = searchParams.get("type") || "all";

    if (initialQuery) {
      setQuery(initialQuery);
      setSelectedType(initialType);
      performSearch(initialQuery, initialType);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL
    const params = new URLSearchParams();
    params.set("q", query);
    if (selectedType !== "all") {
      params.set("type", selectedType);
    }
    router.push(`/search?${params}`);

    performSearch(query, selectedType);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("q", query);
      if (type !== "all") {
        params.set("type", type);
      }
      router.push(`/search?${params}`);
      performSearch(query, type);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "article":
        return "Artikel";
      case "event":
        return "Event";
      case "gallery":
        return "Galeri";
      default:
        return "Semua";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "gallery":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Pencarian HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Temukan artikel, event, dan galeri yang Anda cari di HUMANIKA.
            </p>
          </div>
        </section>

        {/* Search Form */}
        <section className="mb-8">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari artikel, event, galeri..."
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mencari..." : "Cari"}
              </button>
            </div>
          </form>

          {/* Type Filter */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {[
                { value: "all", label: "Semua" },
                { value: "article", label: "Artikel" },
                { value: "event", label: "Event" },
                { value: "gallery", label: "Galeri" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedType === type.value
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section>
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className="mt-4 text-gray-500">Mencari...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => performSearch(query, selectedType)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-400">
                <Icons.search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Tidak ada hasil ditemukan
              </h3>
              <p className="text-gray-500">
                Coba kata kunci yang berbeda atau filter yang lain.
              </p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Menampilkan {results.length} hasil untuk &quot;{query}&quot;
                </p>
              </div>

              <div className="grid gap-6">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
                  >
                    <div className="flex gap-4">
                      {result.image && (
                        <div className="flex-shrink-0">
                          <Image
                            src={result.image}
                            alt={result.title}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              result.type
                            )}`}
                          >
                            {getTypeLabel(result.type)}
                          </span>
                          {result.date && (
                            <span className="text-sm text-gray-500">
                              {formatDate(result.date)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {result.title}
                        </h3>
                        {result.description && (
                          <p className="text-gray-600 line-clamp-2">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
