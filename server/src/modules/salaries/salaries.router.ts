import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { SalariesController } from "./salaries.controller";
import { salaryParamsSchema, salaryUpsertSchema } from "./salaries.schema";

const controller = new SalariesController();

export const salariesRouter = Router();

salariesRouter.get("/current/:userId", validateMiddleware(salaryParamsSchema, "params"), controller.getCurrent);
salariesRouter.get("/history/:userId", validateMiddleware(salaryParamsSchema, "params"), controller.getHistory);
salariesRouter.put(
  "/current/:userId",
  validateMiddleware(salaryParamsSchema, "params"),
  validateMiddleware(salaryUpsertSchema, "body"),
  controller.upsertCurrent,
);

