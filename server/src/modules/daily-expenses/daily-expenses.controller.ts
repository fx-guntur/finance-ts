import type { NextFunction, Request, Response } from "express";
import { ok } from "../../shared/responses/api-response";
import type {
  DailyExpenseIdParamsInput,
  DailyExpenseParamsInput,
  DailyExpenseQueryInput,
  DailyExpenseUpsertInputShape,
} from "./daily-expenses.schema";
import { DailyExpensesService } from "./daily-expenses.service";

export class DailyExpensesController {
  constructor(private readonly service = new DailyExpensesService()) {}

  overview = async (
    req: Request<DailyExpenseParamsInput, unknown, unknown, DailyExpenseQueryInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const overview = await this.service.getOverview(req.params.userId, req.query.date);
      res.status(200).json(ok(overview));
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request<DailyExpenseParamsInput, unknown, DailyExpenseUpsertInputShape>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const created = await this.service.createExpense({
        userId: req.params.userId,
        categoryId: req.body.categoryId,
        amount: req.body.amount,
        spentAt: new Date(`${req.body.spentAt}T00:00:00`),
        merchantName: req.body.merchantName ? req.body.merchantName : null,
        note: req.body.note ? req.body.note : null,
      });

      res.status(201).json(ok(created));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<DailyExpenseIdParamsInput, unknown, DailyExpenseUpsertInputShape>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updated = await this.service.updateExpense(req.params.expenseId, req.params.userId, {
        userId: req.params.userId,
        categoryId: req.body.categoryId,
        amount: req.body.amount,
        spentAt: new Date(`${req.body.spentAt}T00:00:00`),
        merchantName: req.body.merchantName ? req.body.merchantName : null,
        note: req.body.note ? req.body.note : null,
      });

      res.status(200).json(ok(updated));
    } catch (error) {
      next(error);
    }
  };
}
