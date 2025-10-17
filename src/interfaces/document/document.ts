import type { Category } from "../category/category";

export type Document = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: Category;
  urlPdf: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDocument = {
  name: string;
  description: string;
  categoryId: number;
  file: File;
};

export type UpdateDocument = Partial<CreateDocument>;
