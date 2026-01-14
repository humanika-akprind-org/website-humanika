import { Period } from "./period";

export interface Statistic {
  id: string;
  activeMembers: number;
  annualEvents: number;
  collaborativeProjects: number;
  innovationProjects: number;
  awards: number;
  memberSatisfaction: number;
  learningMaterials: number;
  periodId: string;
  period: Period;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStatisticInput {
  activeMembers?: number;
  annualEvents?: number;
  collaborativeProjects?: number;
  innovationProjects?: number;
  awards?: number;
  memberSatisfaction?: number;
  learningMaterials?: number;
  periodId: string;
}

export interface UpdateStatisticInput extends Partial<CreateStatisticInput> {}

export interface StatisticFilter {
  periodId?: string;
}
