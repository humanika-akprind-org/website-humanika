/**
 * Document ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for complex write operations with validation and logging
 * - DELETE: Uses use case for complex delete operations with validation and logging
 *
 * Pattern Choice Rationale:
 * - GET: Use case provides validation for ID format and consistent error handling
 * - PUT: Use case provides validation, logging, and approval workflow
 * - DELETE: Use case provides validation, cascade deletion, and logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateDocumentInput } from "@/domain/entities/document.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetDocumentUseCase,
  UpdateDocumentUseCase,
  DeleteDocumentUseCase,
} from "@/application/use-cases/document";
import { DocumentRepositoryPrisma } from "@/infrastructure/repositories/document";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateDocumentBody(
  request: NextRequest,
): Promise<UpdateDocumentInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateDocumentInput(body: UpdateDocumentInput) {
  // At least one field must be provided
  if (
    !body.name &&
    !body.documentTypeId &&
    !body.status &&
    !body.letterId &&
    body.document === undefined
  ) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/documents/:id - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    // Use use case for single read with validation
    const repo = new DocumentRepositoryPrisma();
    const useCase = new GetDocumentUseCase(repo);
    const document = await useCase.execute(id);

    // Response - consistent format
    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);

    // Handle not found error specifically
    if ((error as Error).message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch document",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/documents/:id - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = (await params).id;
    const body = await extractUpdateDocumentBody(request);

    // Basic validation (use case will do deeper validation)
    const validation = validateUpdateDocumentInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Use use case for complex write with validation, logging, and approval
    const repo = new DocumentRepositoryPrisma();
    const useCase = new UpdateDocumentUseCase(repo);
    const document = await useCase.execute(id, body, { id: user.id });

    // Response
    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error updating document:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    // Handle not found error
    if ((error as Error).message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update document",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/documents/:id - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = (await params).id;

    // Use use case for complex delete with validation, cascade deletion, and logging
    const repo = new DocumentRepositoryPrisma();
    const useCase = new DeleteDocumentUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // Response
    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);

    // Handle validation errors
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    // Handle not found error
    if ((error as Error).message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete document",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
