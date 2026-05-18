import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { ForecastsController } from "./forecasts.controller";
import { forecastParamsSchema, forecastQuerySchema } from "./forecasts.schema";

export const forecastsRouter = Router();
const controller = new ForecastsController();

forecastsRouter.get(
  "/:userId",
  validateMiddleware(forecastParamsSchema, "params"),
  validateMiddleware(forecastQuerySchema, "query"),
  controller.overview,
);
