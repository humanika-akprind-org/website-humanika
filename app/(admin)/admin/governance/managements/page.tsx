import { ManagementApi } from "@/use-cases/api/management";
import { UserApi } from "@/use-cases/api/user";
import { PeriodApi } from "@/use-cases/api/period";
import ManagementTable from "@/components/admin/management/Table";
import PageHeader from "@/components/admin/drive/PageHeader";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import ErrorFallback from "@/components/admin/ErrorFallback";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import type { Management } from "@/types/management";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";

async function ManagementsPage() {
  const accessToken = getGoogleAccessToken();

  try {
    const [managements, usersResponse, periods] = await Promise.all([
      ManagementApi.getManagements(),
      UserApi.getUsers({ allUsers: true }),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];

    // Enhance managements with user and period data
    const enhancedManagements = managements.map((management: Management) => ({
      ...management,
      user: users.find((user: User) => user.id === management.userId),
      period: periods.find(
        (period: Period) => period.id === management.periodId
      ),
    }));

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="min-h-screen">
          <main className="space-y-6">
            <PageHeader
              title="Struktur Management"
              showAddButton={true}
              addButtonHref="/admin/governance/managements/add"
              addButtonText="Tambah Pengurus"
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
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memuat data management";
    return <ErrorFallback error={errorMessage} />;
  }
}

export default ManagementsPage;
