/**
 * Statistic Use Cases Index - Barrel exports
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This file re-exports all statistic use cases for convenient imports.
 */

// Read operations
export { GetStatisticsUseCase } from "./get-statistics.usecase";
export { GetStatisticByIdUseCase } from "./get-statistic-by-id.usecase";

// Write operations
export { CreateStatisticUseCase } from "./create-statistic.usecase";
export { UpdateStatisticUseCase } from "./update-statistic.usecase";
export { DeleteStatisticUseCase } from "./delete-statistic.usecase";
