export interface GalleryCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalleryCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateGalleryCategoryInput
  extends Partial<CreateGalleryCategoryInput> {}
