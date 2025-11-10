import { type NextRequest, NextResponse } from "next/server";
import type { UpdateLetterInput } from "@/types/letter";
import { getCurrentUser } from "@/lib/auth";
import {
  getLetter,
  updateLetter,
  deleteLetter,
} from "@/lib/services/letter/letter.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const letter = await getLetter(params.id);

    if (!letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Error fetching letter:", error);
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

    const body: UpdateLetterInput = await request.json();

    const letter = await updateLetter(params.id, body, user);

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Error updating letter:", error);
    if (error instanceof Error && error.message === "Letter not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
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

    await deleteLetter(params.id, user);

    return NextResponse.json({ message: "Letter deleted successfully" });
  } catch (error) {
    console.error("Error deleting letter:", error);
    if (error instanceof Error && error.message === "Letter not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
