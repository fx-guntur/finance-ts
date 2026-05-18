import { CategoriesRepository } from "./categories.repository";
import type { CategoryCreateInput, CategoryRecord } from "./categories.types";

export class CategoriesService {
  constructor(private readonly repository = new CategoriesRepository()) {}

  async list(userId: string): Promise<CategoryRecord[]> {
    return this.repository.findByUserId(userId);
  }

  async create(input: CategoryCreateInput): Promise<CategoryRecord> {
    return this.repository.create(input);
  }
}
