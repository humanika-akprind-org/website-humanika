export interface EventCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateEventCategoryInput
  extends Partial<CreateEventCategoryInput> {}
