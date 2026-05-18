import { AppError } from "../../shared/errors/app-error";
import { SalariesRepository } from "./salaries.repository";
import type { SalaryRecord, SalaryUpsertInput } from "./salaries.types";

function parseDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid date value", 400);
  }

  return date;
}

export class SalariesService {
  constructor(private readonly repository = new SalariesRepository()) {}

  async getCurrentSalary(userId: string): Promise<SalaryRecord | null> {
    return this.repository.findCurrentByUserId(userId);
  }

  async getSalaryHistory(userId: string): Promise<SalaryRecord[]> {
    return this.repository.findHistoryByUserId(userId);
  }

  async upsertCurrentSalary(input: Omit<SalaryUpsertInput, "effectiveFrom" | "effectiveTo"> & {
    effectiveFrom: string;
    effectiveTo?: string | null;
  }): Promise<SalaryRecord> {
    const effectiveFrom = parseDate(input.effectiveFrom);
    const effectiveTo = input.effectiveTo ? parseDate(input.effectiveTo) : null;

    await this.repository.deactivateCurrentByUserId(input.userId, effectiveFrom);

    return this.repository.createSalary({
      userId: input.userId,
      monthlySalary: input.monthlySalary,
      currency: input.currency,
      paydayDay: input.paydayDay,
      effectiveFrom,
      effectiveTo,
      isActive: input.isActive,
    });
  }
}
