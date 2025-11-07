import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateEventInput } from "@/types/event";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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

    // Get existing event for logging
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const updateData = { ...body } as Prisma.EventUpdateInput;

    // Handle status change to PENDING - create approval record
    if (body.status === "PENDING") {
      // Create approval record for the event
      await prisma.approval.create({
        data: {
          entityType: "EVENT",
          entityId: params.id,
          userId: user.id, // Current user submitting for approval
          status: "PENDING",
          note: "Event submitted for approval",
        },
      });
    }

    // Calculate remaining funds if funds or usedFunds is updated
    if (body.funds !== undefined || body.usedFunds !== undefined) {
      const currentEvent = await prisma.event.findUnique({
        where: { id: params.id },
      });

      if (currentEvent) {
        const funds =
          body.funds !== undefined ? body.funds : currentEvent.funds;
        const usedFunds =
          body.usedFunds !== undefined
            ? body.usedFunds
            : currentEvent.usedFunds;
        updateData.remainingFunds = funds - usedFunds;
      }
    }

    // Handle slug generation if name is updated
    if (body.name) {
      updateData.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Handle date conversions
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);

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
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "Event",
      entityId: event.id,
      description: `Updated event: ${event.name}`,
      metadata: {
        oldData: {
          name: existingEvent.name,
          department: existingEvent.department,
          status: existingEvent.status,
          startDate: existingEvent.startDate,
          endDate: existingEvent.endDate,
          funds: existingEvent.funds,
          usedFunds: existingEvent.usedFunds,
        },
        newData: {
          name: event.name,
          department: event.department,
          status: event.status,
          startDate: event.startDate,
          endDate: event.endDate,
          funds: event.funds,
          usedFunds: event.usedFunds,
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

    // Log activity
    await logActivityFromRequest(_request, {
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "Event",
      entityId: params.id,
      description: `Deleted event: ${existingEvent.name}`,
      metadata: {
        oldData: {
          name: existingEvent.name,
          department: existingEvent.department,
          status: existingEvent.status,
          startDate: existingEvent.startDate,
          endDate: existingEvent.endDate,
          funds: existingEvent.funds,
          usedFunds: existingEvent.usedFunds,
        },
        newData: null,
      },
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
