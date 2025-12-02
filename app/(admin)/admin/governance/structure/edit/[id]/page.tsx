import { PeriodApi } from "@/use-cases/api/period";
import StructureForm from "@/components/admin/structure/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
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
import { notFound } from "next/navigation";

async function EditStructurePage({ params }: { params: { id: string } }) {
  const accessToken = getGoogleAccessToken();

  try {
    const [periods, structure] = await Promise.all([
      PeriodApi.getPeriods(),
      prisma.organizationalStructure.findUnique({
        where: { id: params.id },
        include: { period: true },
      }),
    ]);

    if (!structure) {
      notFound();
    }

    // Transform structure data to match OrganizationalStructure type
    const transformedStructure: OrganizationalStructure = {
      id: structure.id,
      name: structure.name,
      status: structure.status as StatusEnum, // Cast to match custom Status enum
      periodId: structure.periodId,
      period: structure.period,
      decree: structure.decree,
      structure: structure.structure === null ? undefined : structure.structure,
      createdAt: structure.createdAt,
      updatedAt: structure.updatedAt,
    };

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

      // Cast data to UpdateOrganizationalStructureInput since this is the edit page
      const structureData = data as UpdateOrganizationalStructureInput;

      if (!structureData.name || !structureData.periodId) {
        throw new Error("Missing required fields");
      }

      const structurePayload: Partial<
        Omit<
          OrganizationalStructure,
          "id" | "period" | "createdAt" | "updatedAt"
        >
      > = {
        name: structureData.name,
        periodId: structureData.periodId,
        status: structureData.status || ("DRAFT" as StatusEnum),
        decree: structureData.decree || "",
        structure: structureData.structure || "",
      };

      await prisma.organizationalStructure.update({
        where: { id: params.id },
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
              Edit Organizational Structure
            </h1>
          </div>
          <StructureForm
            structure={transformedStructure}
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

export default EditStructurePage;
