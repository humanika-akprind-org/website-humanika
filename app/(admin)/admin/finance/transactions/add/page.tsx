import FinanceForm from "@/components/admin/finance/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/types/finance";
import type { FinanceCategory } from "@/types/finance-category";
import type {
  Department,
  FinanceType,
  UserRole,
  Position,
} from "@/types/enums";
import { ApprovalType } from "@/types/enums";
import { Status } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { type WorkProgram } from "@/types/work";

async function AddFinancePage() {
  const accessToken = await getGoogleAccessToken();

  try {
    // Fetch data directly from database to avoid API authentication issues
    const [categories, workProgramsData] = await Promise.all([
      prisma.financeCategory.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.workProgram.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          period: true,
          responsible: true,
        },
      }),
    ]);

    // Transform data to match expected types
    const transformedCategories: FinanceCategory[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || undefined,
      type: cat.type as FinanceType, // Type assertion to handle enum differences
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    const transformedWorkPrograms: WorkProgram[] = workProgramsData.map(
      (workProgram) => ({
        id: workProgram.id,
        name: workProgram.name,
        department: workProgram.department as Department,
        schedule: workProgram.schedule,
        status: workProgram.status as Status,
        funds: workProgram.funds,
        usedFunds: workProgram.usedFunds,
        remainingFunds: workProgram.remainingFunds,
        goal: workProgram.goal,
        periodId: workProgram.periodId,
        period: workProgram.period,
        responsibleId: workProgram.responsibleId,
        responsible: {
          id: workProgram.responsible.id,
          name: workProgram.responsible.name,
          email: workProgram.responsible.email,
          username: workProgram.responsible.username,
          role: workProgram.responsible.role as UserRole,
          department: workProgram.responsible.department as Department | null,
          position: workProgram.responsible.position as Position | null,
          isActive: workProgram.responsible.isActive,
          verifiedAccount: workProgram.responsible.verifiedAccount,
          attemptLogin: workProgram.responsible.attemptLogin,
          blockExpires: workProgram.responsible.blockExpires,
          createdAt: workProgram.responsible.createdAt,
          updatedAt: workProgram.responsible.updatedAt,
          avatarColor: workProgram.responsible.avatarColor,
        },
        createdAt: workProgram.createdAt,
        updatedAt: workProgram.updatedAt,
      })
    );

    const handleSubmit = async (
      data: CreateFinanceInput | UpdateFinanceInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to CreateFinanceInput since this is the add page
      const financeData = data as CreateFinanceInput;

      if (
        !financeData.name ||
        !financeData.amount ||
        !financeData.categoryId ||
        !financeData.type ||
        !financeData.date
      ) {
        throw new Error("Missing required fields");
      }

      try {
        // Create finance directly using Prisma to avoid API authentication issues
        const financeDataPrisma = {
          name: financeData.name,
          amount: parseFloat(financeData.amount.toString()),
          description: financeData.description || "",
          date: new Date(financeData.date),
          categoryId: financeData.categoryId,
          type: financeData.type,
          userId: user.id,
          proof: financeData.proof,
          ...(financeData.workProgramId &&
            financeData.workProgramId.trim() !== "" && {
              workProgramId: financeData.workProgramId,
            }),
        };

        await prisma.finance.create({
          data: financeDataPrisma,
        });

        redirect("/admin/finance/transactions");
      } catch (error) {
        // Re-throw redirect errors to allow Next.js to handle them
        if (
          error instanceof Error &&
          "digest" in error &&
          typeof error.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT")
        ) {
          throw error;
        }
        console.error("Error creating finance:", error);
        throw new Error("Failed to create finance transaction");
      }
    };

    const handleSubmitForApproval = async (
      data: CreateFinanceInput | UpdateFinanceInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to CreateFinanceInput since this is the add page
      const financeData = data as CreateFinanceInput;

      if (
        !financeData.name ||
        !financeData.amount ||
        !financeData.categoryId ||
        !financeData.type ||
        !financeData.workProgramId ||
        !financeData.date
      ) {
        throw new Error("Missing required fields");
      }

      try {
        // Create finance with PENDING status directly using Prisma
        const financeDataPrisma = {
          name: financeData.name,
          amount: parseFloat(financeData.amount.toString()),
          description: financeData.description || "",
          date: new Date(financeData.date),
          categoryId: financeData.categoryId,
          type: financeData.type,
          workProgramId: financeData.workProgramId,
          userId: user.id,
          status: Status.PENDING,
          proof: financeData.proof,
        };

        // Create the finance with PENDING status
        const finance = await prisma.finance.create({
          data: financeDataPrisma,
        });

        // Create approval record for the finance
        await prisma.approval.create({
          data: {
            entityType: ApprovalType.FINANCE,
            entityId: finance.id,
            userId: user.id,
            status: StatusApproval.PENDING,
          },
        });

        redirect("/admin/finance/transactions");
      } catch (error) {
        // Re-throw redirect errors to allow Next.js to handle them
        if (
          error instanceof Error &&
          "digest" in error &&
          typeof error.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT")
        ) {
          throw error;
        }
        console.error("Error creating finance for approval:", error);
        throw new Error("Failed to create finance transaction for approval");
      }
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/finance/transactions"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Transaction
            </h1>
          </div>
          <FinanceForm
            accessToken={accessToken}
            users={[]}
            categories={transformedCategories}
            workPrograms={transformedWorkPrograms}
            onSubmit={handleSubmit}
            onSubmitForApproval={handleSubmitForApproval}
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

export default AddFinancePage;
