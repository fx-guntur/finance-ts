import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type { CategoryRecord } from "../categories/categories.types";
import type { DailyExpenseRecord, DailyExpenseUpsertInput } from "./daily-expenses.types";

type DailyExpenseModel = {
  id: string;
  userId: string;
  categoryId: string;
  spentAt: Date;
  amount: Prisma.Decimal;
  merchantName: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
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
};

function mapCategory(record: DailyExpenseModel["category"]): CategoryRecord {
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

function toLocalStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function toDateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join(
    "-",
  );
}

function mapExpense(record: DailyExpenseModel): DailyExpenseRecord {
  return {
    id: record.id,
    userId: record.userId,
    categoryId: record.categoryId,
    spentAt: toDateKey(record.spentAt),
    amount: Number(record.amount),
    merchantName: record.merchantName,
    note: record.note,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    category: mapCategory(record.category),
  };
}

export class DailyExpensesRepository {
  async findByDate(userId: string, date: Date) {
    return this.findBetweenDates(userId, toLocalStart(date), toLocalEnd(date));
  }

  async findHistoryByUserId(userId: string, limit = 14) {
    const records = await prisma.dailyExpense.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
      orderBy: [{ spentAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return records.map(mapExpense);
  }

  async findBetweenDates(userId: string, startDate: Date, endDate: Date) {
    const records = await prisma.dailyExpense.findMany({
      where: {
        userId,
        deletedAt: null,
        spentAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: [{ spentAt: "asc" }, { createdAt: "asc" }],
    });

    return records.map(mapExpense);
  }

  async findById(userId: string, expenseId: string) {
    const record = await prisma.dailyExpense.findFirst({
      where: {
        id: expenseId,
        userId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });

    return record ? mapExpense(record) : null;
  }

  async create(input: DailyExpenseUpsertInput) {
    const record = await prisma.dailyExpense.create({
      data: {
        userId: input.userId,
        categoryId: input.categoryId,
        spentAt: input.spentAt,
        amount: new Prisma.Decimal(input.amount),
        merchantName: input.merchantName ?? null,
        note: input.note ?? null,
      },
      include: {
        category: true,
      },
    });

    return mapExpense(record);
  }

  async update(expenseId: string, userId: string, input: DailyExpenseUpsertInput) {
    const existing = await prisma.dailyExpense.findFirst({
      where: {
        id: expenseId,
        userId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return null;
    }

    const record = await prisma.dailyExpense.update({
      where: {
        id: expenseId,
      },
      data: {
        categoryId: input.categoryId,
        spentAt: input.spentAt,
        amount: new Prisma.Decimal(input.amount),
        merchantName: input.merchantName ?? null,
        note: input.note ?? null,
      },
      include: {
        category: true,
      },
    });

    return mapExpense(record);
  }
}
