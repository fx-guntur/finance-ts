import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { MonthlyExpensesController } from "./monthly-expenses.controller";
import {
  monthlyExpenseIdParamsSchema,
  monthlyExpenseParamsSchema,
  monthlyExpenseUpsertSchema,
} from "./monthly-expenses.schema";

const controller = new MonthlyExpensesController();

export const monthlyExpensesRouter = Router();

monthlyExpensesRouter.get("/:userId", validateMiddleware(monthlyExpenseParamsSchema, "params"), controller.overview);
monthlyExpensesRouter.post(
  "/:userId",
  validateMiddleware(monthlyExpenseParamsSchema, "params"),
  validateMiddleware(monthlyExpenseUpsertSchema, "body"),
  controller.create,
);
monthlyExpensesRouter.put(
  "/:userId/:expenseId",
  validateMiddleware(monthlyExpenseIdParamsSchema, "params"),
  validateMiddleware(monthlyExpenseUpsertSchema, "body"),
  controller.update,
);
monthlyExpensesRouter.delete(
  "/:userId/:expenseId",
  validateMiddleware(monthlyExpenseIdParamsSchema, "params"),
  controller.delete,
);
