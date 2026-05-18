import type { SalaryFormErrors, SalaryFormValues } from "./types";

export function createInitialSalaryFormValues(): SalaryFormValues {
  const today = new Date();
  const yyyyMmDd = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return {
    monthlySalary: "",
    currency: "IDR",
    paydayDay: "25",
    effectiveFrom: yyyyMmDd,
    effectiveTo: "",
    isActive: true,
  };
}

export function validateSalaryForm(values: SalaryFormValues): SalaryFormErrors {
  const errors: SalaryFormErrors = {};
  const salaryValue = Number(values.monthlySalary);
  const paydayValue = Number(values.paydayDay);

  if (!values.monthlySalary || Number.isNaN(salaryValue) || salaryValue <= 0) {
    errors.monthlySalary = "Monthly salary must be greater than zero.";
  }

  if (values.currency !== "IDR") {
    errors.currency = "Salary currency must be IDR.";
  }

  if (!values.paydayDay || Number.isNaN(paydayValue) || paydayValue < 1 || paydayValue > 31) {
    errors.paydayDay = "Payday day must be between 1 and 31.";
  }

  if (!values.effectiveFrom) {
    errors.effectiveFrom = "Effective date is required.";
  }

  if (values.effectiveTo && values.effectiveTo < values.effectiveFrom) {
    errors.effectiveTo = "End date must be after start date.";
  }

  return errors;
}
