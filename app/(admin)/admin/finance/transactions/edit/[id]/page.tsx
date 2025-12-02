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
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface EditFinancePageProps {
  params: {
    id: string;
  };
}

async function EditFinancePage({ params }: EditFinancePageProps) {
  const accessToken = getGoogleAccessToken();

  try {
    // Fetch data directly from database to avoid API authentication issues
    const [finance, categories, periodsData, eventsData] = await Promise.all([
      prisma.finance.findUnique({
        where: { id: params.id },
        include: {
          category: true,
          period: true,
          event: {
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
          approvals: true,
          galleries: true,
          finances: true,
          letters: true,
          documents: true,
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
      periodId: finance.periodId,
      eventId: finance.eventId,
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
      period: finance.period,
      event: finance.event
        ? {
            id: finance.event.id,
            name: finance.event.name,
            slug: finance.event.slug,
            thumbnail: finance.event.thumbnail || undefined,
            description: finance.event.description || "",
            responsibleId: finance.event.responsibleId,
            responsible: {
              id: finance.event.responsible.id,
              name: finance.event.responsible.name,
              email: finance.event.responsible.email,
              username: finance.event.responsible.username,
              role: finance.event.responsible.role as UserRole,
              department: finance.event.responsible
                .department as Department | null,
              position: finance.event.responsible.position as Position | null,
              isActive: finance.event.responsible.isActive,
              verifiedAccount: finance.event.responsible.verifiedAccount,
              attemptLogin: finance.event.responsible.attemptLogin,
              blockExpires: finance.event.responsible.blockExpires,
              createdAt: finance.event.responsible.createdAt,
              updatedAt: finance.event.responsible.updatedAt,
              avatarColor: finance.event.responsible.avatarColor,
            },
            goal: finance.event.goal || "",
            department: finance.event.department as Department,
            periodId: finance.event.periodId,
            period: finance.event.period,
            startDate: finance.event.startDate,
            endDate: finance.event.endDate,
            funds: finance.event.funds,
            usedFunds: finance.event.usedFunds,
            remainingFunds: finance.event.remainingFunds,
            status: finance.event.status as Status,
            workProgramId: finance.event.workProgramId,
            workProgram: finance.event.workProgram
              ? {
                  id: finance.event.workProgram.id,
                  name: finance.event.workProgram.name,
                  department: finance.event.workProgram
                    .department as Department,
                  schedule: finance.event.workProgram.schedule,
                  status: finance.event.workProgram.status as Status,
                  funds: finance.event.workProgram.funds,
                  usedFunds: finance.event.workProgram.usedFunds,
                  remainingFunds: finance.event.workProgram.remainingFunds,
                  goal: finance.event.workProgram.goal,
                  periodId: finance.event.workProgram.periodId,
                  period: finance.event.workProgram.period,
                  responsibleId: finance.event.workProgram.responsibleId,
                  responsible: {
                    id: finance.event.workProgram.responsible.id,
                    name: finance.event.workProgram.responsible.name,
                    email: finance.event.workProgram.responsible.email,
                    username: finance.event.workProgram.responsible.username,
                    role: finance.event.workProgram.responsible
                      .role as UserRole,
                    department: finance.event.workProgram.responsible
                      .department as Department | null,
                    position: finance.event.workProgram.responsible
                      .position as Position | null,
                    isActive: finance.event.workProgram.responsible.isActive,
                    verifiedAccount:
                      finance.event.workProgram.responsible.verifiedAccount,
                    attemptLogin:
                      finance.event.workProgram.responsible.attemptLogin,
                    blockExpires:
                      finance.event.workProgram.responsible.blockExpires,
                    createdAt: finance.event.workProgram.responsible.createdAt,
                    updatedAt: finance.event.workProgram.responsible.updatedAt,
                    avatarColor:
                      finance.event.workProgram.responsible.avatarColor,
                  },
                  createdAt: finance.event.workProgram.createdAt,
                  updatedAt: finance.event.workProgram.updatedAt,
                }
              : null,
            approvals: [],
            galleries: [],
            finances: [],
            letters: [],
            documents: [],
            createdAt: finance.event.createdAt,
            updatedAt: finance.event.updatedAt,
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

    // Transform data to match expected types
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
            id: event.workProgram.id,
            name: event.workProgram.name,
            department: event.workProgram.department as Department,
            schedule: event.workProgram.schedule,
            status: event.workProgram.status as Status,
            funds: event.workProgram.funds,
            usedFunds: event.workProgram.usedFunds,
            remainingFunds: event.workProgram.remainingFunds,
            goal: event.workProgram.goal,
            periodId: event.workProgram.periodId,
            period: event.workProgram.period,
            responsibleId: event.workProgram.responsibleId,
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
            createdAt: event.workProgram.createdAt,
            updatedAt: event.workProgram.updatedAt,
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

      // Cast data to UpdateFinanceInput since this is the edit page
      const financeData = data as UpdateFinanceInput;

      if (
        !financeData.name ||
        !financeData.amount ||
        !financeData.type ||
        !financeData.date ||
        !financeData.categoryId ||
        !financeData.periodId
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
          periodId: financeData.periodId,
          proof: financeData.proof,
          ...(financeData.eventId &&
            financeData.eventId.trim() !== "" && {
              eventId: financeData.eventId,
            }),
        };

        await prisma.finance.update({
          where: { id: params.id },
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
        !financeData.periodId
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
          periodId: financeData.periodId,
          status: Status.PENDING,
          proof: financeData.proof,
          ...(financeData.eventId &&
            financeData.eventId.trim() !== "" && {
              eventId: financeData.eventId,
            }),
        };

        // Update the finance with PENDING status
        await prisma.finance.update({
          where: { id: params.id },
          data: financeDataPrisma,
        });

        // Create approval record for the finance
        await prisma.approval.create({
          data: {
            entityType: ApprovalType.FINANCE,
            entityId: params.id,
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

export default EditFinancePage;
