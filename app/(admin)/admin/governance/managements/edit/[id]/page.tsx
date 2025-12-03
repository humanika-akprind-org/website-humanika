import { UserApi } from "@/use-cases/api/user";
import { PeriodApi } from "@/use-cases/api/period";
import ManagementForm from "@/components/admin/management/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import type { ManagementServerData } from "@/types/management";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ManagementService } from "@/services/management/management.service";
import { redirect } from "next/navigation";

async function EditManagementPage({ params }: { params: { id: string } }) {
  const accessToken = getGoogleAccessToken();

  try {
    const [management, usersResponse, periods] = await Promise.all([
      ManagementService.getManagement(params.id),
      UserApi.getUsers({ limit: 50 }),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];

    const handleSubmit = async (data: ManagementServerData) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      await ManagementService.updateManagement(params.id, data, user);
      redirect("/admin/governance/managements");
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/governance/managements"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Management
            </h1>
          </div>
          <ManagementForm
            accessToken={accessToken}
            users={users}
            periods={periods}
            management={management}
            onSubmit={handleSubmit}
          />
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
