import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/types/organization-contact";
import {
  getOrganizationContacts,
  createOrganizationContact,
} from "@/services/organization-contact/organization-contact.service";
import { getCurrentUser } from "@/lib/auth-server";

// Extract payload functions
function extractOrganizationContactQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    periodId: searchParams.get("periodId") || undefined,
  };
}

async function extractCreateOrganizationContactBody(
  request: NextRequest
): Promise<CreateOrganizationContactInput> {
  const body = await request.json();
  return {
    vision: body.vision,
    mission: body.mission,
    phone: body.phone,
    email: body.email,
    address: body.address,
    periodId: body.periodId,
  };
}

// Validation functions
function validateCreateOrganizationContactInput(
  body: CreateOrganizationContactInput
) {
  if (
    !body.vision ||
    !body.mission ||
    !body.email ||
    !body.address ||
    !body.periodId
  ) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractOrganizationContactQueryParams(request);

    // 2. Business logic
    const organizationContacts = await getOrganizationContacts(
      queryParams as OrganizationContactFilter
    );

    // 3. Response
    return NextResponse.json(organizationContacts);
  } catch (error) {
    console.error("Error fetching organization contacts:", error);
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
    const body = await extractCreateOrganizationContactBody(request);

    // 2. Validasi
    const validation = validateCreateOrganizationContactInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const organizationContact = await createOrganizationContact(body, user);

    // 4. Response
    return NextResponse.json(organizationContact, { status: 201 });
  } catch (error) {
    console.error("Error creating organization contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
