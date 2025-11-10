import { type NextRequest, NextResponse } from "next/server";
import type { CreateFinanceInput } from "@/types/finance";
import type { FinanceType, Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import {
  getFinances,
  createFinance,
} from "@/lib/services/finance/finance.service";

function extractFinanceQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    type: searchParams.get("type") as FinanceType,
    status: searchParams.get("status") as unknown as Status,
    periodId: searchParams.get("periodId") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    eventId: searchParams.get("eventId") || undefined,
    search: searchParams.get("search") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
  };
}

async function extractCreateFinanceBody(
  request: NextRequest
): Promise<CreateFinanceInput> {
  return await request.json();
}

function validateCreateFinanceInput(body: CreateFinanceInput) {
  if (
    !body.name ||
    !body.amount ||
    !body.categoryId ||
    !body.type ||
    !body.periodId ||
    !body.date
  ) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queryParams = extractFinanceQueryParams(request);

    const finances = await getFinances(queryParams);

    return NextResponse.json(finances);
  } catch (error) {
    console.error("Error fetching finances:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await extractCreateFinanceBody(request);

    const validation = validateCreateFinanceInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const finance = await createFinance(body, user);

    return NextResponse.json(finance, { status: 201 });
  } catch (error) {
    console.error("Error creating finance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
