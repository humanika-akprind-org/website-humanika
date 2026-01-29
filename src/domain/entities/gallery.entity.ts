import { type GalleryCategory } from "../value-objects/gallery-category";
import { type Event } from "./event.entity";
import { type Period } from "./period.entity";

export interface Gallery {
  id: string;
  title: string;
  eventId: string;
  event?: Event;
  categoryId?: string | null;
  category?: GalleryCategory;
  image: string;
  periodId?: string | null;
  period?: Period;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalleryInput {
  title: string;
  eventId: string;
  categoryId?: string;
  image: string;
  periodId?: string;
}

export interface UpdateGalleryInput extends Partial<CreateGalleryInput> {}

export interface GalleryFilter {
  eventId?: string;
  categoryId?: string;
  search?: string;
  periodId?: string;
}
