import { type NextRequest, NextResponse } from "next/server";
import type { CreateOrganizationalStructureInput } from "@/types/structure";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import {
  getStructures,
  createStructure,
} from "@/services/structure/structure.service";

// Extract payload functions
async function extractCreateStructureBody(request: NextRequest) {
  return await request.json();
}

// Validation functions
function validateCreateStructureInput(
  body: CreateOrganizationalStructureInput
) {
  if (!body.name || !body.periodId || !body.decree) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const search = searchParams.get("search");

    // Allow public access only for published structures
    if (status === "PUBLISH") {
      // Public access for published structures
      const structures = await getStructures({
        status,
        periodId: periodId || undefined,
        search: search || undefined,
      });
      return NextResponse.json(structures);
    }

    // Require authentication for other operations
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Business logic
    const structures = await getStructures({
      status,
      periodId: periodId || undefined,
      search: search || undefined,
    });

    // 2. Response
    return NextResponse.json(structures);
  } catch (error) {
    console.error("Error fetching organizational structures:", error);
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

    // 1. Extract payload
    const body = await extractCreateStructureBody(request);

    // 2. Validation
    const validation = validateCreateStructureInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const structure = await createStructure(body, user);

    // 4. Response
    return NextResponse.json(structure, { status: 201 });

    // 4. Response
    return NextResponse.json(structure, { status: 201 });
  } catch (error) {
    console.error("Error creating organizational structure:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
