import { request } from "../../../lib/api/http-client";
import type { RecommendationOverview, RecommendationQuery } from "../types";

export async function fetchRecommendations(userId: string, query?: RecommendationQuery) {
  const params = new URLSearchParams();

  if (query?.date) {
    params.set("date", query.date);
  }

  if (query?.holidayDates) {
    params.set("holidayDates", query.holidayDates);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<RecommendationOverview>(`/api/v1/recommendations/${userId}${suffix}`);
}
