/**
 * Base Repository - Generic CRUD implementation
 * Part of Clean Architecture: Infrastructure Layer
 *
 * This abstract class provides common CRUD operations for all repositories.
 * Extend this class for entity-specific repositories.
 */

import prisma from "@/presentation/lib/prisma";
import type { PrismaClient } from "@prisma/client";
import type { IBaseRepository } from "@/application/interface/base.repository.interface";

// Type for accessing any Prisma model dynamically
type PrismaModelDelegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: { where: { id: string } }) => Promise<unknown | null>;
  create: (args: { data: unknown }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: unknown }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
  count: (args?: unknown) => Promise<number>;
};

export abstract class BaseRepository<
  T,
  TId,
  TCreate,
  TUpdate,
> implements IBaseRepository<T, TId, TCreate, TUpdate> {
  protected prisma: PrismaClient;
  protected model: string;

  constructor(prismaModel: string) {
    this.prisma = prisma;
    this.model = prismaModel;
  }

  private get modelDelegate(): PrismaModelDelegate {
    return this.prisma[
      this.model as keyof PrismaClient
    ] as unknown as PrismaModelDelegate;
  }

  async findAll(): Promise<T[]> {
    return (await this.modelDelegate.findMany()) as T[];
  }

  async findById(id: TId): Promise<T | null> {
    return (await this.modelDelegate.findUnique({
      where: { id: id as string },
    })) as T | null;
  }

  async create(data: TCreate): Promise<T> {
    return (await this.modelDelegate.create({
      data: data as object,
    })) as T;
  }

  async update(id: TId, data: TUpdate): Promise<T> {
    return (await this.modelDelegate.update({
      where: { id: id as string },
      data: data as object,
    })) as T;
  }

  async delete(id: TId): Promise<void> {
    await this.modelDelegate.delete({
      where: { id: id as string },
    });
  }

  async count(where?: unknown): Promise<number> {
    return await this.modelDelegate.count({ where });
  }
}
