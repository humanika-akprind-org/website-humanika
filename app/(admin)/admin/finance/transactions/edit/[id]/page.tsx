import FinanceForm from "@/components/admin/finance/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/types/finance";
import type { FinanceCategory } from "@/types/finance-category";
import type { Finance } from "@/types/finance";
import type {
  Department,
  FinanceType,
  UserRole,
  Position,
} from "@/types/enums";
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { type WorkProgram } from "@/types/work";

async function EditFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessToken = await getGoogleAccessToken();

  try {
    // Fetch data directly from database to avoid API authentication issues
    const [finance, categories, workProgramsData] = await Promise.all([
      prisma.finance.findUnique({
        where: { id },
        include: {
          category: true,
          workProgram: {
            include: {
              period: true,
              responsible: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  username: true,
                  role: true,
                  department: true,
                  position: true,
                  isActive: true,
                  verifiedAccount: true,
                  attemptLogin: true,
                  blockExpires: true,
                  createdAt: true,
                  updatedAt: true,
                  avatarColor: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              role: true,
              department: true,
              position: true,
              isActive: true,
              verifiedAccount: true,
              attemptLogin: true,
              blockExpires: true,
              createdAt: true,
              updatedAt: true,
              avatarColor: true,
            },
          },
        },
      }),
      prisma.financeCategory.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.workProgram.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          period: true,
          responsible: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              role: true,
              department: true,
              position: true,
              isActive: true,
              verifiedAccount: true,
              attemptLogin: true,
              blockExpires: true,
              createdAt: true,
              updatedAt: true,
              avatarColor: true,
            },
          },
        },
      }),
    ]);

    if (!finance) {
      notFound();
    }

    // Transform data to match expected types
    const transformedFinance: Finance = {
      id: finance.id,
      name: finance.name,
      amount: finance.amount,
      description: finance.description || "",
      date: finance.date,
      categoryId: finance.categoryId!,
      type: finance.type as FinanceType,
      workProgramId: finance.workProgramId,
      userId: finance.userId,
      status: finance.status as Status,
      proof: finance.proof,
      createdAt: finance.createdAt,
      updatedAt: finance.updatedAt,
      // Relations
      category: finance.category
        ? {
            id: finance.category.id,
            name: finance.category.name,
            type: finance.category.type as FinanceType,
            description: finance.category.description ?? undefined,
            createdAt: finance.category.createdAt,
            updatedAt: finance.category.updatedAt,
          }
        : undefined,
      workProgram: finance.workProgram
        ? {
            id: finance.workProgram.id,
            name: finance.workProgram.name,
            department: finance.workProgram.department as Department,
            schedule: finance.workProgram.schedule,
            status: finance.workProgram.status as Status,
            funds: finance.workProgram.funds,
            usedFunds: finance.workProgram.usedFunds,
            remainingFunds: finance.workProgram.remainingFunds,
            goal: finance.workProgram.goal,
            periodId: finance.workProgram.periodId,
            period: finance.workProgram.period,
            responsibleId: finance.workProgram.responsibleId,
            responsible: {
              id: finance.workProgram.responsible.id,
              name: finance.workProgram.responsible.name,
              email: finance.workProgram.responsible.email,
              username: finance.workProgram.responsible.username,
              role: finance.workProgram.responsible.role as UserRole,
              department: finance.workProgram.responsible
                .department as Department | null,
              position: finance.workProgram.responsible
                .position as Position | null,
              isActive: finance.workProgram.responsible.isActive,
              verifiedAccount: finance.workProgram.responsible.verifiedAccount,
              attemptLogin: finance.workProgram.responsible.attemptLogin,
              blockExpires: finance.workProgram.responsible.blockExpires,
              createdAt: finance.workProgram.responsible.createdAt,
              updatedAt: finance.workProgram.responsible.updatedAt,
              avatarColor: finance.workProgram.responsible.avatarColor,
            },
            createdAt: finance.workProgram.createdAt,
            updatedAt: finance.workProgram.updatedAt,
          }
        : null,
      user: {
        id: finance.user.id,
        name: finance.user.name,
        email: finance.user.email,
        username: finance.user.username,
        role: finance.user.role as UserRole,
        department: finance.user.department as Department | null,
        position: finance.user.position as Position | null,
        isActive: finance.user.isActive,
        verifiedAccount: finance.user.verifiedAccount,
        attemptLogin: finance.user.attemptLogin,
        blockExpires: finance.user.blockExpires,
        createdAt: finance.user.createdAt,
        updatedAt: finance.user.updatedAt,
        avatarColor: finance.user.avatarColor,
      },
      approvals: [], // Optional approvals array
    };

    const transformedCategories: FinanceCategory[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description ?? undefined,
      type: cat.type as FinanceType,
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

      // Cast data to UpdateFinanceInput since this is the edit page
      const financeData = data as UpdateFinanceInput;

      if (
        !financeData.name ||
        !financeData.amount ||
        !financeData.type ||
        !financeData.date ||
        !financeData.categoryId ||
        !financeData.workProgramId
      ) {
        throw new Error("Missing required fields");
      }

      try {
        // Update finance directly using Prisma to avoid API authentication issues
        const financeDataPrisma = {
          name: financeData.name,
          amount: parseFloat(financeData.amount.toString()),
          description: financeData.description || "",
          date: new Date(financeData.date),
          categoryId: financeData.categoryId,
          type: financeData.type,
          workProgramId: financeData.workProgramId,
          proof: financeData.proof,
        };

        await prisma.finance.update({
          where: { id },
          data: financeDataPrisma,
        });

        redirect("/admin/finance/transactions");
      } catch (error) {
        // Re-throw redirect errors to allow Next.js to handle them
        if (
          error instanceof Error &&
          (error as Error & { digest?: string }).digest?.startsWith(
            "NEXT_REDIRECT"
          )
        ) {
          throw error;
        }
        console.error("Error updating finance:", error);
        throw new Error("Failed to update finance transaction");
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

      // Cast data to UpdateFinanceInput since this is the edit page
      const financeData = data as UpdateFinanceInput;

      if (
        !financeData.name ||
        !financeData.amount ||
        !financeData.type ||
        !financeData.date ||
        !financeData.categoryId ||
        !financeData.workProgramId
      ) {
        throw new Error("Missing required fields");
      }

      try {
        // Update finance with PENDING status directly using Prisma
        const financeDataPrisma = {
          name: financeData.name,
          amount: parseFloat(financeData.amount.toString()),
          description: financeData.description || "",
          date: new Date(financeData.date),
          categoryId: financeData.categoryId,
          type: financeData.type,
          workProgramId: financeData.workProgramId,
          status: Status.PENDING,
          proof: financeData.proof,
        };

        // Update the finance with PENDING status
        await prisma.finance.update({
          where: { id: (await params).id },
          data: financeDataPrisma,
        });

        // Create approval record for the finance
        await prisma.approval.create({
          data: {
            entityType: ApprovalType.FINANCE,
            entityId: (await params).id,
            userId: user.id,
            status: StatusApproval.PENDING,
          },
        });

        redirect("/admin/finance/transactions");
      } catch (error) {
        // Re-throw redirect errors to allow Next.js to handle them
        if (
          error instanceof Error &&
          (error as Error & { digest?: string }).digest?.startsWith(
            "NEXT_REDIRECT"
          )
        ) {
          throw error;
        }
        console.error("Error updating finance for approval:", error);
        throw new Error("Failed to update finance transaction for approval");
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
              Edit Transaction
            </h1>
          </div>
          <FinanceForm
            finance={transformedFinance}
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

export default EditFinancePage;
