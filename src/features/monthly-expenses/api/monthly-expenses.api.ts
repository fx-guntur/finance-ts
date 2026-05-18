import { request } from "../../../lib/api/http-client";
import type { MonthlyExpensesOverview, MonthlyExpenseRecord } from "../types";

export type MonthlyExpenseUpsertPayload = {
  categoryId: string;
  title: string;
  amount: number;
  dueDay: number;
  isMandatory: boolean;
  billingCycle: string;
  notes?: string | null;
  isActive: boolean;
};

export async function fetchMonthlyExpensesOverview(userId: string) {
  return request<MonthlyExpensesOverview>(`/api/v1/monthly-expenses/${userId}`);
}

export async function createMonthlyExpense(userId: string, payload: MonthlyExpenseUpsertPayload) {
  return request<MonthlyExpenseRecord>(`/api/v1/monthly-expenses/${userId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMonthlyExpense(
  userId: string,
  expenseId: string,
  payload: MonthlyExpenseUpsertPayload,
) {
  return request<MonthlyExpenseRecord>(`/api/v1/monthly-expenses/${userId}/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteMonthlyExpense(userId: string, expenseId: string) {
  return request<{ deleted: true }>(`/api/v1/monthly-expenses/${userId}/${expenseId}`, {
    method: "DELETE",
  });
}
