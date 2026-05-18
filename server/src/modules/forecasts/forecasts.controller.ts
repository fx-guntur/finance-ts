import type { NextFunction, Request, Response } from "express";
import { ok } from "../../shared/responses/api-response";
import type { ForecastParamsInput, ForecastQueryInput } from "./forecasts.schema";
import { ForecastsService } from "./forecasts.service";

export class ForecastsController {
  constructor(private readonly service = new ForecastsService()) {}

  overview = async (
    req: Request<ForecastParamsInput, unknown, unknown, ForecastQueryInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const overview = await this.service.getOverview(req.params.userId, {
        date: req.query.date,
        horizonDays: req.query.horizonDays,
      });

      res.status(200).json(ok(overview));
    } catch (error) {
      next(error);
    }
  };
}
