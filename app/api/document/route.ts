/**
 * Document API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET documents: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateDocumentInput,
  DocumentFilter,
} from "@/domain/entities/document.entity";
import type { Status } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetDocumentsUseCase,
  CreateDocumentUseCase,
} from "@/application/use-cases/document";
import { DocumentRepositoryPrisma } from "@/infrastructure/repositories/document";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractDocumentQueryParams(request: NextRequest): DocumentFilter {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get("status") as Status | undefined,
    documentTypeId: searchParams.get("documentTypeId") || undefined,
    userId: searchParams.get("userId") || undefined,
    letterId: searchParams.get("letterId") || undefined,
    search: searchParams.get("search") || undefined,
    periodId: searchParams.get("periodId") || undefined,
  };
}

async function extractCreateDocumentBody(
  request: NextRequest,
): Promise<CreateDocumentInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateDocumentInput(body: CreateDocumentInput) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.documentTypeId) {
    errors.push("Document type ID is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/documents - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractDocumentQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new DocumentRepositoryPrisma();
    const useCase = new GetDocumentsUseCase(repo);
    const result = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.documents,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch documents",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/documents - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Extract payload
    const body = await extractCreateDocumentBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateDocumentInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new DocumentRepositoryPrisma();
    const useCase = new CreateDocumentUseCase(repo);
    const document = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: document,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating document:", error);

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

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
