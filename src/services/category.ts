import type { Category, CreateCategory } from "../interfaces/category/category";
import { api, ContentType } from "./api";

export async function getParentCategories() {
  return await api.get<Category[]>(ContentType.CATEGORY);
}

export async function createCategory(data: CreateCategory) {
  return await api.post<CreateCategory, Category>(ContentType.CATEGORY, data);
}
