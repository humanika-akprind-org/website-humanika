import FinanceForm from "@/components/admin/finance/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/types/finance";
import type { FinanceCategory } from "@/types/finance-category";
import type { Period } from "@/types/period";
import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import type { Finance } from "@/types/finance";
import type { Letter } from "@/types/letter";
import type { Document } from "@/types/document";
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
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

async function AddFinancePage() {
  const accessToken = getGoogleAccessToken();

  try {
    // Fetch data directly from database to avoid API authentication issues
    const [categories, periodsData, eventsData] = await Promise.all([
      prisma.financeCategory.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.period.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.findMany({
        orderBy: { startDate: "desc" },
        include: {
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
          period: true,
          workProgram: {
            include: {
              period: true,
              responsible: true,
            },
          },
          approvals: true,
          galleries: true,
          finances: true,
          letters: true,
          documents: true,
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

    const transformedEvents: Event[] = eventsData.map((event) => ({
      id: event.id,
      name: event.name,
      slug: event.slug,
      thumbnail: event.thumbnail || undefined,
      description: event.description || "",
      responsibleId: event.responsibleId,
      responsible: {
        id: event.responsible.id,
        name: event.responsible.name,
        email: event.responsible.email,
        username: event.responsible.username,
        role: event.responsible.role as UserRole,
        department: event.responsible.department as Department | null,
        position: event.responsible.position as Position | null,
        isActive: event.responsible.isActive,
        verifiedAccount: event.responsible.verifiedAccount,
        attemptLogin: event.responsible.attemptLogin,
        blockExpires: event.responsible.blockExpires,
        createdAt: event.responsible.createdAt,
        updatedAt: event.responsible.updatedAt,
        avatarColor: event.responsible.avatarColor,
      },
      goal: event.goal || "",
      department: event.department as Department,
      periodId: event.periodId,
      period: event.period,
      startDate: event.startDate,
      endDate: event.endDate,
      funds: event.funds,
      usedFunds: event.usedFunds,
      remainingFunds: event.remainingFunds,
      status: event.status as Status,
      workProgramId: event.workProgramId,
      workProgram: event.workProgram
        ? {
            ...event.workProgram,
            department: event.workProgram.department as Department,
            status: event.workProgram.status as Status,
            responsible: {
              id: event.workProgram.responsible.id,
              name: event.workProgram.responsible.name,
              email: event.workProgram.responsible.email,
              username: event.workProgram.responsible.username,
              role: event.workProgram.responsible.role as UserRole,
              department: event.workProgram.responsible
                .department as Department | null,
              position: event.workProgram.responsible
                .position as Position | null,
              isActive: event.workProgram.responsible.isActive,
              verifiedAccount: event.workProgram.responsible.verifiedAccount,
              attemptLogin: event.workProgram.responsible.attemptLogin,
              blockExpires: event.workProgram.responsible.blockExpires,
              createdAt: event.workProgram.responsible.createdAt,
              updatedAt: event.workProgram.responsible.updatedAt,
              avatarColor: event.workProgram.responsible.avatarColor,
            },
          }
        : null,
      approvals: event.approvals.map((approval) => ({
        ...approval,
        entityType: approval.entityType as ApprovalType,
        note: approval.note || undefined,
        createdAt: approval.createdAt.toISOString(),
        updatedAt: approval.updatedAt.toISOString(),
      })),
      galleries: event.galleries as Gallery[],
      finances: event.finances as Finance[],
      letters: event.letters as Letter[],
      documents: event.documents as Document[],
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    const transformedPeriods: Period[] = periodsData.map((period) => ({
      id: period.id,
      name: period.name,
      startYear: period.startYear,
      endYear: period.endYear,
      isActive: period.isActive,
      createdAt: period.createdAt,
      updatedAt: period.updatedAt,
    }));

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
        !financeData.periodId ||
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
          periodId: financeData.periodId,
          userId: user.id,
          proof: financeData.proof,
          ...(financeData.eventId &&
            financeData.eventId.trim() !== "" && {
              eventId: financeData.eventId,
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
        !financeData.periodId ||
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
          periodId: financeData.periodId,
          userId: user.id,
          status: Status.PENDING,
          proof: financeData.proof,
          ...(financeData.eventId &&
            financeData.eventId.trim() !== "" && {
              eventId: financeData.eventId,
            }),
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
            periods={transformedPeriods}
            events={transformedEvents}
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
