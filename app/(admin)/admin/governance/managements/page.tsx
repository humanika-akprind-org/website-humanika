import Link from "next/link";
import { ManagementApi } from "@/lib/api/management";
import { UserApi } from "@/lib/api/user";
import { PeriodApi } from "@/lib/api/period";
import ManagementTable from "@/components/admin/management/ManagementTable";
import PageHeader from "@/components/admin/drive/PageHeader";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type { Management } from "@/types/management";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";

async function ManagementsPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const [managements, usersResponse, periods] = await Promise.all([
      ManagementApi.getManagements(),
      UserApi.getUsers(),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];

    // Enhance managements with user and period data
    const enhancedManagements = managements.map((management: Management) => ({
      ...management,
      user: users.find((user: User) => user.id === management.userId),
      period: periods.find((period: Period) => period.id === management.periodId),
    }));

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="min-h-screen bg-gray-50">
          <main className="p-6 space-y-6">
            <PageHeader
              title="Struktur Management"
              showAddButton={true}
              addButtonHref="/admin/governance/managements/add"
              addButtonText="Tambah Anggota"
            />

            <ManagementTable
              managements={enhancedManagements}
              accessToken={accessToken}
            />
          </main>
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading managements:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Error Loading Managements</h2>
              <p className="mt-2 text-gray-600">
                {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data management"}
              </p>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Coba Lagi
                </button>
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Kembali ke Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManagementsPage;
