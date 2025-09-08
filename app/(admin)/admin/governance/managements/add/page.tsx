import { UserApi } from "@/lib/api/user";
import { PeriodApi } from "@/lib/api/period";
import ManagementForm from "@/components/admin/management/Form";
import PageHeader from "@/components/admin/drive/PageHeader";
import { ManagementApi } from "@/lib/api/management";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type { ManagementServerData } from "@/types/management";

async function AddManagementPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const [usersResponse, periods] = await Promise.all([
      UserApi.getUsers(),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];

    const handleSubmit = async (data: ManagementServerData) => {
      "use server";
      await ManagementApi.createManagement(data);
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <PageHeader title="Tambah Management Baru" />
            <ManagementForm
              accessToken={accessToken}
              users={users}
              periods={periods}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-4">Error Loading Form</h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddManagementPage;
