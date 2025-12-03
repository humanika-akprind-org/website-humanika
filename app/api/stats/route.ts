import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCount = await prisma.user.count({
      where: { isActive: true },
    });

    const eventCount = await prisma.event.count({
      where: { status: "PUBLISH" },
    });

    const workProgramCount = await prisma.workProgram.count({
      where: { status: "PUBLISH" },
    });

    // Assuming awards are not in schema, use a placeholder or calculate from something else
    const awardCount = 15; // Placeholder

    const stats = [
      { number: userCount.toString(), label: "Anggota Aktif" },
      { number: eventCount.toString(), label: "Kegiatan Tahunan" },
      { number: workProgramCount.toString(), label: "Program Kerja" },
      { number: awardCount.toString(), label: "Penghargaan" },
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
