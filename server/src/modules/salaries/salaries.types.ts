export type SalaryRecord = {
  id: string;
  userId: string;
  monthlySalary: number;
  currency: string;
  paydayDay: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SalaryUpsertInput = {
  userId: string;
  monthlySalary: number;
  currency: string;
  paydayDay: number;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  isActive: boolean;
};
