import { Status } from "./enums";
import { GalleryCategory } from "./gallery-category";
import { Event } from "./event";

export interface Gallery {
  id: string;
  title: string;
  eventId: string;
  event?: Event;
  categoryId?: string | null;
  category?: GalleryCategory;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalleryInput {
  title: string;
  eventId: string;
  categoryId?: string;
  image: string;
}

export interface UpdateGalleryInput extends Partial<CreateGalleryInput> {}

export interface GalleryFilter {
  eventId?: string;
  search?: string;
}
