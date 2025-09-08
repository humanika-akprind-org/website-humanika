import { UserApi } from "@/lib/api/user";
import { PeriodApi } from "@/lib/api/period";
import { ManagementApi } from "@/lib/api/management";
import ManagementForm from "@/components/admin/management/Form";
import PageHeader from "@/components/admin/drive/PageHeader";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type { ManagementServerData } from "@/types/management";

async function EditManagementPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const [management, usersResponse, periods] = await Promise.all([
      ManagementApi.getManagement(params.id),
      UserApi.getUsers(),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];

    const handleSubmit = async (data: ManagementServerData) => {
      "use server";
      await ManagementApi.updateManagement(params.id, data);
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <PageHeader title={`Edit Management: ${management.user?.name}`} />
            <ManagementForm
              accessToken={accessToken}
              users={users}
              periods={periods}
              management={management}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading management:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-4">
                Error Loading Management
              </h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditManagementPage;
