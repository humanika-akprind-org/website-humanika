import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateWorkProgramInput } from "@/types/work";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

// GET work program by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workProgram = await prisma.workProgram.findUnique({
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
      },
    });

    if (!workProgram) {
      return NextResponse.json(
        { error: "Work program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workProgram);
  } catch (error) {
    console.error("Error fetching work program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update work program
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateWorkProgramInput = await request.json();

    const updateData = { ...body } as Prisma.WorkProgramUpdateInput;

    // Calculate remaining funds if funds or usedFunds is updated
    if (body.funds !== undefined || body.usedFunds !== undefined) {
      const currentProgram = await prisma.workProgram.findUnique({
        where: { id: params.id },
      });

      if (currentProgram) {
        const funds =
          body.funds !== undefined ? body.funds : currentProgram.funds;
        const usedFunds =
          body.usedFunds !== undefined
            ? body.usedFunds
            : currentProgram.usedFunds;
        updateData.remainingFunds = funds - usedFunds;
      }
    }

    const workProgram = await prisma.workProgram.update({
      where: { id: params.id },
      data: updateData as Prisma.WorkProgramUpdateInput,
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
      },
    });

    return NextResponse.json(workProgram);
  } catch (error) {
    console.error("Error updating work program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE work program
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.workProgram.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Work program deleted successfully" });
  } catch (error) {
    console.error("Error deleting work program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
