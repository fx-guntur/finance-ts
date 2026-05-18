import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { DailyExpensesController } from "./daily-expenses.controller";
import {
  dailyExpenseIdParamsSchema,
  dailyExpenseParamsSchema,
  dailyExpenseQuerySchema,
  dailyExpenseUpsertSchema,
} from "./daily-expenses.schema";

export const dailyExpensesRouter = Router();
const controller = new DailyExpensesController();

dailyExpensesRouter.get(
  "/:userId",
  validateMiddleware(dailyExpenseParamsSchema, "params"),
  validateMiddleware(dailyExpenseQuerySchema, "query"),
  controller.overview,
);

dailyExpensesRouter.post(
  "/:userId",
  validateMiddleware(dailyExpenseParamsSchema, "params"),
  validateMiddleware(dailyExpenseUpsertSchema, "body"),
  controller.create,
);

dailyExpensesRouter.put(
  "/:userId/:expenseId",
  validateMiddleware(dailyExpenseIdParamsSchema, "params"),
  validateMiddleware(dailyExpenseUpsertSchema, "body"),
  controller.update,
);
