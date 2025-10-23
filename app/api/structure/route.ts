import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateOrganizationalStructureInput } from "@/types/structure";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const search = searchParams.get("search");

    const where: Prisma.OrganizationalStructureWhereInput = {};

    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const structures = await prisma.organizationalStructure.findMany({
      where,
      include: {
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });

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

    const body: CreateOrganizationalStructureInput = await request.json();

    if (!body.name || !body.periodId || !body.decree) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const structureData: Prisma.OrganizationalStructureCreateInput = {
      name: body.name,
      period: { connect: { id: body.periodId } },
      decree: body.decree,
      structure: body.structure,
    };

    const structure = await prisma.organizationalStructure.create({
      data: structureData,
      include: {
        period: true,
      },
    });

    return NextResponse.json(structure, { status: 201 });
  } catch (error) {
    console.error("Error creating organizational structure:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
