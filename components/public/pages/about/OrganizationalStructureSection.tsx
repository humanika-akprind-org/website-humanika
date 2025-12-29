import { useState, useEffect } from "react";
import type { OrganizationalStructure } from "@/types/structure";
import StructureAvatar from "@/components/admin/ui/avatar/ImageView";
import { Users, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrganizationalStructureSection() {
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

  // Get the latest published structure
  const latestStructure = structures.length > 0 ? structures[0] : null;

  return (
    <section className="mt-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
          <div className="w-2 h-2 bg-primary-500 rounded-full" />
          STRUKTUR ORGANISASI
        </div>
        <h2 className="text-4xl font-bold text-grey-900 mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Kepemimpinan & Tim
          </span>{" "}
          Kami
        </h2>
        <p className="text-grey-600 max-w-2xl mx-auto">
          Kenali tim kepemimpinan yang membawa HUMANIKA menuju visi dan misi
          yang telah ditetapkan.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-grey-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <p className="mt-4 text-grey-600 font-medium">
              Memuat struktur organisasi...
            </p>
          </div>
        ) : error || !latestStructure ? (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-20 h-20 bg-grey-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-grey-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-grey-900 mb-2">
                  {error || "Struktur Belum Tersedia"}
                </h3>
                <p className="text-grey-600">
                  {error
                    ? "Silakan coba lagi nanti"
                    : "Struktur organisasi sedang dalam proses pembaruan"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-grey-900">
                  {latestStructure.name}
                </h3>
                <p className="text-grey-600">
                  Periode {new Date(latestStructure.createdAt).getFullYear()}
                </p>
              </div>
              <Link
                href="/structure"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                <span>Lihat Detail</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="border-2 border-dashed border-grey-200 rounded-xl p-8 bg-grey-50 flex justify-center items-center">
              <StructureAvatar
                imageUrl={latestStructure.structure}
                alt={latestStructure.name}
                size={{ width: 1600, height: 900 }}
                modalTitle={`Struktur Organisasi ${latestStructure.name}`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
