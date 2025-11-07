import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const search = searchParams.get("search");

    const where: Prisma.GalleryWhereInput = {};

    if (eventId) where.eventId = eventId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { event: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const galleries = await prisma.gallery.findMany({
      where,
      include: {
        event: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
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

    const body = await request.json();
    const { title, eventId, image } = body;

    if (!title || !eventId || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        eventId,
        image, // This is the Google Drive file ID
      },
      include: {
        event: true,
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Gallery",
      entityId: gallery.id,
      description: `Created gallery: ${gallery.title}`,
      metadata: {
        newData: {
          title: gallery.title,
          eventId: gallery.eventId,
          image: gallery.image,
        },
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
