import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { RecommendationsController } from "./recommendations.controller";
import { recommendationParamsSchema, recommendationQuerySchema } from "./recommendations.schema";

export const recommendationsRouter = Router();
const controller = new RecommendationsController();

recommendationsRouter.get(
  "/:userId",
  validateMiddleware(recommendationParamsSchema, "params"),
  validateMiddleware(recommendationQuerySchema, "query"),
  controller.overview,
);
