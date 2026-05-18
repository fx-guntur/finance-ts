import { request } from "../../../lib/api/http-client";
import type { CategoryCreatePayload, CategoryRecord } from "../types";

export async function fetchCategories(userId: string) {
  return request<CategoryRecord[]>(`/api/v1/categories/${userId}`);
}

export async function createCategory(userId: string, payload: CategoryCreatePayload) {
  return request<CategoryRecord>(`/api/v1/categories/${userId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
