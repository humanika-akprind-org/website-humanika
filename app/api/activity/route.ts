/**
 * Activity API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 *
 * Pattern Choice Rationale:
 * - GET activities: Use case provides better separation for role-based filtering
 *   and department aggregation for radar chart visualization
 */

import { type NextRequest, NextResponse } from "next/server";
import { UserRole, Department } from "@/domain/enums";
import { GetActivitiesRadarChartUseCase } from "@/application/use-cases/activity";

// ============================================================================
// Configuration Constants
// ============================================================================

const ALLOWED_ROLES: UserRole[] = [
  UserRole.DPO,
  UserRole.BPH,
  UserRole.PENGURUS,
];

const ALLOWED_DEPARTMENTS: Department[] = [
  Department.BPH,
  Department.INFOKOM,
  Department.LITBANG,
  Department.KWU,
  Department.PSDM,
];

// ============================================================================
// GET /api/activity - Use Case Pattern
// ============================================================================

export async function GET(_request: NextRequest) {
  try {
    // Use use case for complex read with role-based filtering and aggregation
    const useCase = new GetActivitiesRadarChartUseCase();
    const result = await useCase.execute({
      allowedRoles: ALLOWED_ROLES,
      allowedDepartments: ALLOWED_DEPARTMENTS,
    });

    // Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activity statistics",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
