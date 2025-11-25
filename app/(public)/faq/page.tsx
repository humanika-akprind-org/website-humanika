import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Apa itu HUMANIKA?",
    answer:
      "HUMANIKA (Himpunan Mahasiswa Informatika) adalah organisasi mahasiswa yang mewadahi seluruh mahasiswa Program Studi Informatika dalam berbagai kegiatan akademik dan non-akademik. Kami berkomitmen untuk menciptakan lingkungan yang mendukung pengembangan keterampilan teknis dan soft skills.",
  },
  {
    question: "Bagaimana cara bergabung dengan HUMANIKA?",
    answer:
      "Untuk bergabung dengan HUMANIKA, Anda dapat mendaftar melalui website kami di halaman registrasi. Pastikan Anda adalah mahasiswa aktif Program Studi Informatika dan mengikuti proses seleksi yang telah ditentukan.",
  },
  {
    question: "Apa saja persyaratan untuk bergabung dengan HUMANIKA?",
    answer:
      "Persyaratan utama adalah menjadi mahasiswa aktif Program Studi Informatika. Selain itu, Anda perlu mengisi formulir pendaftaran, mengikuti proses seleksi, dan berkomitmen untuk aktif dalam kegiatan organisasi.",
  },
  {
    question: "Apa saja kegiatan yang diselenggarakan HUMANIKA?",
    answer:
      "HUMANIKA menyelenggarakan berbagai kegiatan seperti workshop teknologi, seminar, kompetisi programming, kegiatan sosial, dan proyek kolaborasi. Kami juga memiliki divisi-divisi khusus untuk pengembangan skill di bidang tertentu.",
  },
  {
    question: "Apa saja divisi yang tersedia di HUMANIKA?",
    answer:
      "HUMANIKA memiliki beberapa divisi seperti Divisi Pemberdayaan Sumber Daya Mahasiswa, Informasi dan Komunikasi, Divisi Penelitian dan Pengembangan, dan Divisi Wirausaha. Setiap divisi fokus pada pengembangan skill di bidangnya masing-masing.",
  },
  {
    question: "Bagaimana cara terlibat dalam kegiatan HUMANIKA?",
    answer:
      "Anda dapat terlibat dengan mengikuti kegiatan yang diumumkan melalui website, media sosial, atau grup komunikasi HUMANIKA. Anggota aktif juga dapat mengajukan proposal kegiatan atau bergabung dalam tim penyelenggara.",
  },
  {
    question: "Apakah HUMANIKA memberikan sertifikat untuk kegiatan?",
    answer:
      "Ya, HUMANIKA menyediakan sertifikat bagi peserta yang mengikuti kegiatan kami. Sertifikat ini dapat digunakan untuk portofolio akademik dan profesional Anda.",
  },
  {
    question: "Apa manfaat bergabung dengan HUMANIKA?",
    answer:
      "Bergabung dengan HUMANIKA memberikan kesempatan untuk mengembangkan skill teknis, networking dengan profesional IT, pengalaman organisasi, sertifikat kegiatan, dan kesempatan untuk berkontribusi dalam proyek-proyek inovatif.",
  },
  {
    question: "Seberapa sering HUMANIKA mengadakan pertemuan?",
    answer:
      "HUMANIKA mengadakan pertemuan rutin mingguan untuk koordinasi internal, serta kegiatan-kegiatan khusus sesuai dengan program kerja. Jadwal lengkap dapat dilihat di kalender kegiatan kami.",
  },
  {
    question: "Apakah alumni dapat tetap terhubung dengan HUMANIKA?",
    answer:
      "Ya, HUMANIKA memiliki komunitas alumni yang tetap terhubung. Alumni dapat bergabung dalam mentoring program, networking events, dan kontribusi untuk pengembangan organisasi.",
  },
  {
    question: "Jenis proyek apa yang dikerjakan HUMANIKA?",
    answer:
      "HUMANIKA mengerjakan berbagai proyek seperti pengembangan aplikasi, website, sistem informasi, proyek riset, dan kolaborasi dengan industri. Proyek-proyek ini memberikan pengalaman praktis bagi anggota.",
  },
  {
    question: "Bagaimana cara mengajukan ide atau inisiatif baru?",
    answer:
      "Anda dapat mengajukan ide melalui pengurus HUMANIKA atau melalui forum diskusi anggota. Tim kami akan meninjau proposal Anda dan mendiskusikan kemungkinan implementasinya.",
  },
  {
    question: "Bagaimana cara menghubungi HUMANIKA?",
    answer:
      "Anda dapat menghubungi kami melalui halaman kontak di website ini, atau mengikuti media sosial HUMANIKA untuk informasi terkini. Kami juga memiliki email resmi dan grup komunikasi untuk anggota.",
  },
  {
    question: "Apakah HUMANIKA hanya untuk mahasiswa informatika?",
    answer:
      "Ya, HUMANIKA khusus untuk mahasiswa Program Studi Informatika. Namun, kami terbuka untuk berkolaborasi dengan mahasiswa dari jurusan lain dalam kegiatan bersama.",
  },
  {
    question: "Kapan periode pendaftaran anggota baru?",
    answer:
      "Pendaftaran anggota baru biasanya dibuka setiap awal semester. Informasi terkini mengenai jadwal pendaftaran dapat dilihat di website atau media sosial HUMANIKA.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-2 md:text-[64px] mb-6">
              Pertanyaan Umum
            </h1>
            <p className="text-body-1 text-primary-100 max-w-2xl mx-auto mb-10">
              Temukan jawaban atas pertanyaan-pertanyaan yang sering ditanyakan
              tentang HUMANIKA dan kegiatan kami
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-heading-2 text-grey-900 mb-4">
                FAQ HUMANIKA
              </h2>
              <p className="text-body-1 text-grey-600">
                Jawaban atas pertanyaan yang paling sering ditanyakan
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-grey-900 flex items-start">
                      <span className="bg-primary-100 text-primary-600 p-1 rounded mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-2 text-grey-700 leading-relaxed pl-9">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-grey-200">
                <h3 className="text-heading-3 text-grey-900 mb-4">
                  Masih ada pertanyaan?
                </h3>
                <p className="text-body-2 text-grey-600 mb-6 max-w-2xl mx-auto">
                  Jika pertanyaan Anda tidak terjawab di atas, jangan ragu untuk
                  menghubungi kami. Tim HUMANIKA siap membantu Anda.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    Hubungi Kami
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-3 bg-transparent border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
