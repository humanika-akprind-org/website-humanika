import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateEventInput } from "@/types/event";
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

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        period: true,
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
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

    const body: UpdateEventInput = await request.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Calculate remaining funds if funds or usedFunds are updated
    let remainingFunds = existingEvent.remainingFunds;
    if (body.funds !== undefined || body.usedFunds !== undefined) {
      const newFunds = body.funds ?? existingEvent.funds;
      const newUsedFunds = body.usedFunds ?? existingEvent.usedFunds;
      remainingFunds = newFunds - newUsedFunds;
    }

    const updateData: Record<string, unknown> = {};

    if (body.name) {
      updateData.name = body.name;
      updateData.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.goal !== undefined) updateData.goal = body.goal;
    if (body.department) updateData.department = body.department;
    if (body.periodId) updateData.periodId = body.periodId;
    if (body.responsibleId) updateData.responsibleId = body.responsibleId;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);
    if (body.funds !== undefined) updateData.funds = body.funds;
    if (body.usedFunds !== undefined) updateData.usedFunds = body.usedFunds;
    // Only include workProgramId if it's provided and not empty
    if (body.workProgramId !== undefined && body.workProgramId.trim() !== "") {
      updateData.workProgramId = body.workProgramId;
    } else if (body.workProgramId === "") {
      // If empty string is provided, set to null to clear the relation
      updateData.workProgramId = null;
    }
    if (body.status) updateData.status = body.status;

    updateData.remainingFunds = remainingFunds;

    const event = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
      include: {
        period: true,
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
