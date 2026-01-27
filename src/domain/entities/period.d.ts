import { ObjectId } from "mongodb";

export interface Period {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PeriodFormData {
  name: string;
  startYear: number;
  endYear: number;
  isActive: boolean;
}

export type PeriodApiResponse = {
  success: boolean;
  data?: Period | Period[];
  message?: string;
  error?: string;
};
