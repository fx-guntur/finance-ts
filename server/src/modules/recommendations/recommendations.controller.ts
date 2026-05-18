import type { NextFunction, Request, Response } from "express";
import { ok } from "../../shared/responses/api-response";
import type { RecommendationParamsInput, RecommendationQueryInput } from "./recommendations.schema";
import { RecommendationsService } from "./recommendations.service";

export class RecommendationsController {
  constructor(private readonly service = new RecommendationsService()) {}

  overview = async (
    req: Request<RecommendationParamsInput, unknown, unknown, RecommendationQueryInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const overview = await this.service.getOverview(req.params.userId, {
        date: req.query.date,
        holidayDates: req.query.holidayDates,
      });

      res.status(200).json(ok(overview));
    } catch (error) {
      next(error);
    }
  };
}
