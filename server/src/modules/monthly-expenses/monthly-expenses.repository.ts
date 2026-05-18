import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type { CategoryRecord } from "../categories/categories.types";
import type { MonthlyExpenseRecord, MonthlyExpenseUpsertInput } from "./monthly-expenses.types";

type MonthlyExpenseModel = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  amount: Prisma.Decimal;
  dueDay: number;
  isMandatory: boolean;
  billingCycle: string;
  notes: string | null;
  isActive: boolean;
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

function mapCategory(record: MonthlyExpenseModel["category"]): CategoryRecord {
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

function getLastDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function mapNextDueDate(dueDay: number, baseDate = new Date()) {
  const base = startOfDay(baseDate);
  const year = base.getFullYear();
  const month = base.getMonth();
  const currentDay = Math.min(dueDay, getLastDayOfMonth(year, month));
  let candidate = new Date(year, month, currentDay);

  if (candidate < base) {
    const nextMonthDate = new Date(year, month + 1, 1);
    const nextMonthDay = Math.min(dueDay, getLastDayOfMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth()));
    candidate = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), nextMonthDay);
  }

  return candidate;
}

function mapExpense(record: MonthlyExpenseModel): MonthlyExpenseRecord {
  const nextDueDate = mapNextDueDate(record.dueDay);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.max(
    0,
    Math.ceil((startOfDay(nextDueDate).getTime() - startOfDay(new Date()).getTime()) / msPerDay),
  );

  return {
    id: record.id,
    userId: record.userId,
    categoryId: record.categoryId,
    title: record.title,
    amount: Number(record.amount),
    dueDay: record.dueDay,
    isMandatory: record.isMandatory,
    billingCycle: record.billingCycle,
    notes: record.notes,
    isActive: record.isActive,
    nextDueDate: nextDueDate.toISOString(),
    daysUntilDue,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    category: mapCategory(record.category),
  };
}

export class MonthlyExpensesRepository {
  async findByUserId(userId: string) {
    const records = await prisma.monthlyExpense.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
      orderBy: [{ isActive: "desc" }, { dueDay: "asc" }, { createdAt: "desc" }],
    });

    return records.map(mapExpense);
  }

  async findById(userId: string, expenseId: string) {
    const record = await prisma.monthlyExpense.findFirst({
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

  async create(input: MonthlyExpenseUpsertInput) {
    const record = await prisma.monthlyExpense.create({
      data: {
        userId: input.userId,
        categoryId: input.categoryId,
        title: input.title,
        amount: new Prisma.Decimal(input.amount),
        dueDay: input.dueDay,
        isMandatory: input.isMandatory,
        billingCycle: input.billingCycle,
        notes: input.notes ?? null,
        isActive: input.isActive,
      },
      include: {
        category: true,
      },
    });

    return mapExpense(record);
  }

  async update(expenseId: string, userId: string, input: MonthlyExpenseUpsertInput) {
    const existing = await prisma.monthlyExpense.findFirst({
      where: {
        id: expenseId,
        userId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return null;
    }

    const record = await prisma.monthlyExpense.update({
      where: {
        id: expenseId,
      },
      data: {
        categoryId: input.categoryId,
        title: input.title,
        amount: new Prisma.Decimal(input.amount),
        dueDay: input.dueDay,
        isMandatory: input.isMandatory,
        billingCycle: input.billingCycle,
        notes: input.notes ?? null,
        isActive: input.isActive,
      },
      include: {
        category: true,
      },
    });

    return mapExpense(record);
  }

  async softDelete(expenseId: string, userId: string) {
    const record = await prisma.monthlyExpense.findFirst({
      where: {
        id: expenseId,
        userId,
        deletedAt: null,
      },
    });

    if (!record) {
      return false;
    }

    await prisma.monthlyExpense.update({
      where: { id: expenseId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return true;
  }

  async getCategories(userId: string) {
    const categories = await prisma.category.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return categories.map((record) => mapCategory(record));
  }
}
