import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type { SalaryRecord, SalaryUpsertInput } from "./salaries.types";

type SalaryModel = {
  id: string;
  userId: string;
  monthlySalary: Prisma.Decimal;
  currency: string;
  paydayDay: number;
  effectiveFrom: Date;
  effectiveTo: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function mapSalary(record: SalaryModel): SalaryRecord {
  return {
    id: record.id,
    userId: record.userId,
    monthlySalary: Number(record.monthlySalary),
    currency: record.currency,
    paydayDay: record.paydayDay,
    effectiveFrom: record.effectiveFrom.toISOString(),
    effectiveTo: record.effectiveTo ? record.effectiveTo.toISOString() : null,
    isActive: record.isActive,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class SalariesRepository {
  async findCurrentByUserId(userId: string) {
    const record = await prisma.salary.findFirst({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });

    return record ? mapSalary(record) : null;
  }

  async findHistoryByUserId(userId: string) {
    const records = await prisma.salary.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [
        {
          effectiveFrom: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return records.map(mapSalary);
  }

  async deactivateCurrentByUserId(userId: string, effectiveTo: Date) {
    await prisma.salary.updateMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      data: {
        isActive: false,
        effectiveTo,
      },
    });
  }

  async createSalary(input: SalaryUpsertInput) {
    const record = await prisma.salary.create({
      data: {
        userId: input.userId,
        monthlySalary: new Prisma.Decimal(input.monthlySalary),
        currency: input.currency,
        paydayDay: input.paydayDay,
        effectiveFrom: input.effectiveFrom,
        effectiveTo: input.effectiveTo ?? null,
        isActive: input.isActive,
      },
    });

    return mapSalary(record);
  }
}
