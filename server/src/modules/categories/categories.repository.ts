import { prisma } from "../../config/prisma";
import type { CategoryCreateInput, CategoryRecord } from "./categories.types";

type CategoryModel = {
  id: string;
  userId: string;
  name: string;
  type: string;
  color: string | null;
  iconKey: string | null;
  sortOrder: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function mapCategory(record: CategoryModel): CategoryRecord {
  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    type: record.type,
    color: record.color,
    iconKey: record.iconKey,
    sortOrder: record.sortOrder,
    isSystem: record.isSystem,
    isActive: record.isActive,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class CategoriesRepository {
  async findByUserId(userId: string) {
    const categories = await prisma.category.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return categories.map(mapCategory);
  }

  async create(input: CategoryCreateInput) {
    const category = await prisma.category.create({
      data: {
        userId: input.userId,
        name: input.name,
        type: input.type,
        color: input.color ?? null,
        iconKey: input.iconKey ?? null,
        sortOrder: input.sortOrder ?? 0,
        isSystem: input.isSystem ?? false,
        isActive: input.isActive ?? true,
      },
    });

    return mapCategory(category);
  }
}
