import { NextResponse } from "next/server";
import { getActivePeriodOrganizationContact } from "@/services/organization-contact/organization-contact.service";

export async function GET() {
  try {
    const organizationContact = await getActivePeriodOrganizationContact();

    if (!organizationContact) {
      return NextResponse.json(
        { error: "No active period organization contact found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organizationContact);
  } catch (error) {
    console.error("Error fetching active period organization contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
