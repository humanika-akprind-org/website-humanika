import Link from "next/link";
import ArticleCard from "@/components/public/article/ArticleCard";
import EventCard from "@/components/public/event/EventCard";
import LatestGalleryGrid from "@/components/public/gallery/LatestGalleryGrid";
import type { Gallery } from "@/types/gallery";
import type { Article } from "@/types/article";
import type { Event } from "@/types/event";

interface Stat {
  number: string;
  label: string;
}

export default async function Home() {
  // Fetch data from database
  const articlesResponse = await fetch(
    `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/article?isPublished=true`,
    { cache: "no-store" }
  );
  const articles = articlesResponse.ok ? await articlesResponse.json() : [];

  const eventsResponse = await fetch(
    `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/event?status=PUBLISH`,
    { cache: "no-store" }
  );
  const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];
  const now = new Date();
  const upcomingEvents = eventsData
    .filter((event: Event) => new Date(event.startDate) > now)
    .slice(0, 3); // Limit to 3 upcoming events for home page

  const galleriesResponse = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/gallery`,
    { cache: "no-store" }
  );
  const galleries: Gallery[] = galleriesResponse.ok
    ? await galleriesResponse.json()
    : [];

  const statsResponse = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/stats`,
    { cache: "no-store" }
  );
  const stats = statsResponse.ok
    ? await statsResponse.json()
    : [
        { number: "0", label: "Anggota Aktif" },
        { number: "0", label: "Kegiatan Tahunan" },
        { number: "0", label: "Proyek Kolaborasi" },
        { number: "0", label: "Penghargaan" },
      ];

  return (
    <div className="min-h-screen bg-grey-50">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-2 md:text-[64px] mb-6">
              Berinovasi, Berkarya,{" "}
              <span className="text-primary-200">Berkolaborasi</span>
            </h1>
            <p className="text-body-1 text-primary-100 max-w-2xl mx-auto mb-10">
              HUMANIKA menghimpun mahasiswa informatika untuk mengembangkan
              potensi, menciptakan inovasi, dan membangun komunitas yang
              berdampak.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/about"
                className="px-8 py-4 bg-white text-primary-700 rounded-lg hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Jelajahi HUMANIKA
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-transparent border-2 border-red-500 text-white rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
              >
                Bergabung Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 mt-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat: Stat, index: number) => (
              <div
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl"
              >
                <div className="text-heading-1 text-primary-200">
                  {stat.number}
                </div>
                <div className="text-caption-1 text-primary-100 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Artikel Terbaru */}
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-grey-900 mb-4">
              Artikel Terbaru
            </h2>
            <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
              Temukan wawasan dan perspektif terbaru seputar teknologi dan
              informatika
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/article"
              className="inline-flex items-center px-6 py-3 bg-white border border-grey-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Lihat Semua Artikel
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

      {/* 3. Tentang Kami */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-2 text-primary-600 font-semibold uppercase tracking-wider text-overline-1">
                TENTANG KAMI
              </div>
              <h2 className="text-heading-3 text-grey-900 mb-6">
                Mengenal HUMANIKA
              </h2>
              <p className="text-body-2 text-grey-700 mb-6 leading-relaxed">
                HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi
                mahasiswa yang mewadahi seluruh mahasiswa Program Studi
                Informatika dalam berbagai kegiatan akademik dan non-akademik.
                Kami berkomitmen untuk menciptakan lingkungan yang mendukung
                pengembangan keterampilan teknis dan soft skills.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <div className="mr-3 bg-primary-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-grey-900">Komunitas</div>
                    <div className="text-caption-1 text-grey-600">
                      500+ anggota
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 bg-primary-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-grey-900">Inovasi</div>
                    <div className="text-caption-1 text-grey-600">
                      20+ proyek
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Pelajari Lebih Lanjut
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-grey-200">
              <h3 className="text-heading-5 text-primary-800 mb-6 border-b border-grey-200 pb-3">
                Visi & Misi
              </h3>
              <div className="mb-6">
                <h4 className="font-semibold text-grey-900 mb-2 flex items-center">
                  <span className="bg-primary-100 text-primary-600 p-1 rounded mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Visi
                </h4>
                <p className="text-body-2 text-grey-700 pl-7">
                  Menjadi wadah utama pengembangan talenta digital yang inovatif
                  dan kolaboratif untuk menciptakan dampak positif bagi
                  masyarakat.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-grey-900 mb-2 flex items-center">
                  <span className="bg-primary-100 text-primary-600 p-1 rounded mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Misi
                </h4>
                <ul className="text-body-2 text-grey-700 pl-7 space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Meningkatkan kompetensi anggota di bidang teknologi
                    informasi
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Menjalin kolaborasi dengan industri dan komunitas
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Mengembangkan solusi inovatif untuk masalah sosial
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Event Terdekat */}
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-grey-900 mb-4">
              Event Terdekat
            </h2>
            <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
              Ikuti kegiatan dan acara terbaru kami untuk mengembangkan skill
              dan jaringan profesional Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/event"
              className="inline-flex items-center px-6 py-3 bg-white border border-grey-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Lihat Semua Event
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

      {/* 5. Galeri */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-grey-900 mb-4">
              Galeri Kegiatan
            </h2>
            <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
              Dokumentasi momen berharga dari berbagai kegiatan dan acara
              HUMANIKA
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

      {/* 6. Kontak CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-heading-2 mb-6">Tertarik untuk Bergabung?</h2>
          <p className="text-body-1 text-primary-100 max-w-2xl mx-auto mb-10">
            Mari berkolaborasi dan kembangkan potensi Anda bersama HUMANIKA. Tim
            kami siap membantu dan mendukung perjalanan Anda di dunia teknologi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-primary-700 rounded-lg hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Hubungi Kami
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-transparent border-2 border-red-500 text-white rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
            >
              Daftar Menjadi Anggota
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
