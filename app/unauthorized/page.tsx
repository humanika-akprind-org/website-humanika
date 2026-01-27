import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-500">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Akses Ditolak
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/dashboard/overview"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kembali ke Dashboard
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Login dengan akun lain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
