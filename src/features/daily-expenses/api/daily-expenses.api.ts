import { request } from "../../../lib/api/http-client";
import type { DailyExpenseRecord, DailyExpensesOverview } from "../types";

export type DailyExpenseUpsertPayload = {
  categoryId: string;
  amount: number;
  spentAt: string;
  merchantName?: string | null;
  note?: string | null;
};

export async function fetchDailyExpensesOverview(userId: string, date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return request<DailyExpensesOverview>(`/api/v1/daily-expenses/${userId}${query}`);
}

export async function createDailyExpense(userId: string, payload: DailyExpenseUpsertPayload) {
  return request<DailyExpenseRecord>(`/api/v1/daily-expenses/${userId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDailyExpense(
  userId: string,
  expenseId: string,
  payload: DailyExpenseUpsertPayload,
) {
  return request<DailyExpenseRecord>(`/api/v1/daily-expenses/${userId}/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
