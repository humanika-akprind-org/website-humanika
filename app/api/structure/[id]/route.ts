import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateOrganizationalStructureInput } from "@/types/structure";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const structure = await prisma.organizationalStructure.findUnique({
      where: { id: params.id },
      include: {
        period: true,
      },
    });

    if (!structure) {
      return NextResponse.json(
        { error: "Organizational structure not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error fetching organizational structure:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateOrganizationalStructureInput = await request.json();

    // Check if structure exists
    const existingStructure = await prisma.organizationalStructure.findUnique({
      where: { id: params.id },
    });

    if (!existingStructure) {
      return NextResponse.json(
        { error: "Organizational structure not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.periodId !== undefined) updateData.periodId = body.periodId;
    if (body.decree !== undefined) updateData.decree = body.decree;
    if (body.structure !== undefined) updateData.structure = body.structure;
    if (body.status !== undefined) updateData.status = body.status;

    const structure = await prisma.organizationalStructure.update({
      where: { id: params.id },
      data: updateData,
      include: {
        period: true,
      },
    });

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error updating organizational structure:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if structure exists
    const existingStructure = await prisma.organizationalStructure.findUnique({
      where: { id: params.id },
    });

    if (!existingStructure) {
      return NextResponse.json(
        { error: "Organizational structure not found" },
        { status: 404 }
      );
    }

    await prisma.organizationalStructure.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Organizational structure deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting organizational structure:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
