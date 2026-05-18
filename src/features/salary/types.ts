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

export type SalaryFormValues = {
  monthlySalary: string;
  currency: string;
  paydayDay: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
};

export type SalaryFormErrors = Partial<Record<keyof SalaryFormValues, string>>;
