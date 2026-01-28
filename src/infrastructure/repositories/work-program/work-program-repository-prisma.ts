/**
 * Work Program Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository wraps existing work program functions
 * and implements the IWorkProgramRepository interface.
 */

import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";
import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";
import {
  getWorkPrograms,
  getWorkProgram,
  createWorkProgram,
  updateWorkProgram,
  deleteWorkProgram,
} from "./index";

/**
 * Work Program Repository Prisma Implementation
 *
 * This class wraps existing repository functions to implement
 * the standardized repository interface for Clean Architecture.
 */
export class WorkProgramRepositoryPrisma implements IWorkProgramRepository {
  /**
   * Get all work programs with optional filtering
   */
  async getWorkPrograms(filter?: WorkProgramFilter): Promise<WorkProgram[]> {
    return getWorkPrograms(filter);
  }

  /**
   * Get a single work program by its ID
   */
  async getWorkProgramById(id: string): Promise<WorkProgram | null> {
    return getWorkProgram(id);
  }

  /**
   * Create a new work program
   */
  async createWorkProgram(
    data: CreateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram> {
    // The existing create function expects a user object with id
    return createWorkProgram(data, { id: user.id } as { id: string });
  }

  /**
   * Update an existing work program
   */
  async updateWorkProgram(
    id: string,
    data: UpdateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram> {
    // The existing update function expects a user object with id
    return updateWorkProgram(id, data, { id: user.id } as { id: string });
  }

  /**
   * Delete a single work program by its ID
   */
  async deleteWorkProgram(id: string, user: { id: string }): Promise<void> {
    // The existing delete function expects a user object with id
    await deleteWorkProgram(id, { id: user.id } as { id: string });
  }
}
