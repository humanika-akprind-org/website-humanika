import { type NextRequest, NextResponse } from "next/server";
import type { CreateFinanceCategoryInput } from "@/types/finance-category";
import type { FinanceType } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth-server";
import {
  getFinanceCategories,
  createFinanceCategory,
} from "@/services/finance/finance-category.service";

function extractFinanceCategoryQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    type: searchParams.get("type") as FinanceType,
    isActive: searchParams.get("isActive") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateFinanceCategoryBody(
  request: NextRequest
): Promise<CreateFinanceCategoryInput> {
  return await request.json();
}

function validateCreateFinanceCategoryInput(body: CreateFinanceCategoryInput) {
  if (!body.name || !body.type) {
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

    const queryParams = extractFinanceCategoryQueryParams(request);

    const financeCategories = await getFinanceCategories(queryParams);

    return NextResponse.json(financeCategories);
  } catch (error) {
    console.error("Error fetching finance categories:", error);
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

    const body = await extractCreateFinanceCategoryBody(request);

    const validation = validateCreateFinanceCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const financeCategory = await createFinanceCategory(body, user);

    return NextResponse.json(financeCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating finance category:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Category name must be unique" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
