import { request } from "../../../lib/api/http-client";
import type { ForecastOverview, ForecastQuery } from "../types";

export async function fetchForecasts(userId: string, query?: ForecastQuery) {
  const params = new URLSearchParams();

  if (query?.date) {
    params.set("date", query.date);
  }

  if (query?.horizonDays) {
    params.set("horizonDays", query.horizonDays);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<ForecastOverview>(`/api/v1/forecasts/${userId}${suffix}`);
}
