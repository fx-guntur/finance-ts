import type { NextFunction, Request, Response } from "express";
import { ok } from "../../shared/responses/api-response";
import type {
  MonthlyExpenseIdParamsInput,
  MonthlyExpenseParamsInput,
  MonthlyExpenseUpsertInputShape,
} from "./monthly-expenses.schema";
import { MonthlyExpensesService } from "./monthly-expenses.service";

export class MonthlyExpensesController {
  constructor(private readonly service = new MonthlyExpensesService()) {}

  overview = async (req: Request<MonthlyExpenseParamsInput>, res: Response, next: NextFunction) => {
    try {
      const overview = await this.service.getOverview(req.params.userId);
      res.status(200).json(ok(overview));
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request<MonthlyExpenseParamsInput, unknown, MonthlyExpenseUpsertInputShape>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const created = await this.service.createExpense({
        userId: req.params.userId,
        categoryId: req.body.categoryId,
        title: req.body.title,
        amount: req.body.amount,
        dueDay: req.body.dueDay,
        isMandatory: req.body.isMandatory,
        billingCycle: req.body.billingCycle,
        notes: req.body.notes ?? null,
        isActive: req.body.isActive,
      });

      res.status(201).json(ok(created));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<MonthlyExpenseIdParamsInput, unknown, MonthlyExpenseUpsertInputShape>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updated = await this.service.updateExpense(req.params.expenseId, req.params.userId, {
        userId: req.params.userId,
        categoryId: req.body.categoryId,
        title: req.body.title,
        amount: req.body.amount,
        dueDay: req.body.dueDay,
        isMandatory: req.body.isMandatory,
        billingCycle: req.body.billingCycle,
        notes: req.body.notes ?? null,
        isActive: req.body.isActive,
      });

      res.status(200).json(ok(updated));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<MonthlyExpenseIdParamsInput>, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.deleteExpense(req.params.expenseId, req.params.userId);
      res.status(200).json(ok(result));
    } catch (error) {
      next(error);
    }
  };
}
