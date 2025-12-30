import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFoundState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-grey-400 text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-grey-900 mb-2">
          Article Not Found
        </h1>
        <p className="text-grey-600">
          The requested article could not be found.
        </p>
        <Link
          href="/article"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Articles
        </Link>
      </div>
    </div>
  );
}
