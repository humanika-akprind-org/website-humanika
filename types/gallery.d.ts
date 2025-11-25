import { Status } from "./enums";
import { GalleryCategory } from "./gallery-category";

export interface Gallery {
  id: string;
  title: string;
  image: string;
  eventId: string;
  gallery?: string | null;
  categoryId?: string | null;
  category?: GalleryCategory | null;
  createdAt: Date;
  updatedAt: Date;
  event?: {
    id: string;
    name: string;
  };
}

export interface CreateGalleryInput {
  title: string;
  image: string;
  eventId: string;
  gallery?: string | null;
  categoryId?: string;
  file?: File;
}

export interface UpdateGalleryInput extends Partial<CreateGalleryInput> {}

export interface GalleryFilter {
  eventId?: string;
  search?: string;
}
