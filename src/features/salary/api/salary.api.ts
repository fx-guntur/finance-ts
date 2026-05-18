import { request } from "../../../lib/api/http-client";
import type { SalaryRecord } from "../types";

export type SalaryUpsertPayload = {
  monthlySalary: number;
  currency: string;
  paydayDay: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
};

export async function fetchCurrentSalary(userId: string) {
  return request<SalaryRecord | null>(`/api/v1/salaries/current/${userId}`);
}

export async function fetchSalaryHistory(userId: string) {
  return request<SalaryRecord[]>(`/api/v1/salaries/history/${userId}`);
}

export async function saveCurrentSalary(userId: string, payload: SalaryUpsertPayload) {
  return request<SalaryRecord>(`/api/v1/salaries/current/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
