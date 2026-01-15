import { type NextRequest, NextResponse } from "next/server";
import type { UpdateOrganizationContactInput } from "@/types/organization-contact";
import {
  getOrganizationContact,
  updateOrganizationContact,
  deleteOrganizationContact,
} from "@/services/organization-contact/organization-contact.service";
import { getCurrentUser } from "@/lib/auth-server";

interface OrganizationContactParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: OrganizationContactParams
) {
  try {
    const { id } = await params;

    // Business logic
    const organizationContact = await getOrganizationContact(id);

    if (!organizationContact) {
      return NextResponse.json(
        { error: "Organization contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organizationContact);
  } catch (error) {
    console.error("Error fetching organization contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: OrganizationContactParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validation - check if organization contact exists
    const existingOrganizationContact = await getOrganizationContact(id);
    if (!existingOrganizationContact) {
      return NextResponse.json(
        { error: "Organization contact not found" },
        { status: 404 }
      );
    }

    // Business logic
    const updateData: UpdateOrganizationContactInput = {
      vision: body.vision,
      mission: body.mission,
      phone: body.phone,
      email: body.email,
      address: body.address,
      periodId: body.periodId,
    };

    const organizationContact = await updateOrganizationContact(
      id,
      updateData,
      user
    );

    return NextResponse.json(organizationContact);
  } catch (error) {
    console.error("Error updating organization contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: OrganizationContactParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Business logic
    await deleteOrganizationContact(id, user);

    return NextResponse.json({
      message: "Organization contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting organization contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
