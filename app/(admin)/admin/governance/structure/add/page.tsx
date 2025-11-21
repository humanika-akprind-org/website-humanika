import { PeriodApi } from "@/use-cases/api/period";
import StructureForm from "@/components/admin/structure/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type {
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
  OrganizationalStructure,
} from "@/types/structure";
import type { Status as StatusEnum } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AddStructurePage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const periods = await PeriodApi.getPeriods();

    const handleSubmit = async (
      data:
        | CreateOrganizationalStructureInput
        | UpdateOrganizationalStructureInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to CreateOrganizationalStructureInput since this is the add page
      const structureData = data as CreateOrganizationalStructureInput;

      if (!structureData.name || !structureData.periodId) {
        throw new Error("Missing required fields");
      }

      const structurePayload: Omit<
        OrganizationalStructure,
        "id" | "period" | "createdAt" | "updatedAt"
      > = {
        name: structureData.name,
        periodId: structureData.periodId,
        status: (structureData.status as StatusEnum) || ("DRAFT" as StatusEnum),
        decree: structureData.decree || "",
        structure: structureData.structure || "",
      };

      await prisma.organizationalStructure.create({
        data: structurePayload,
      });

      redirect("/admin/governance/structure");
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/governance/structure"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Add Organizational Structure
            </h1>
          </div>
          <StructureForm
            accessToken={accessToken}
            periods={periods}
            onSubmit={handleSubmit}
          />
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

export default AddStructurePage;
