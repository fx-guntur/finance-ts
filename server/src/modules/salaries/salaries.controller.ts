import type { NextFunction, Request, Response } from "express";
import { ok } from "../../shared/responses/api-response";
import { AppError } from "../../shared/errors/app-error";
import type { SalaryParamsInput, SalaryUpsertInputShape } from "./salaries.schema";
import { SalariesService } from "./salaries.service";

export class SalariesController {
  constructor(private readonly service = new SalariesService()) {}

  getCurrent = async (
    req: Request<SalaryParamsInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const currentSalary = await this.service.getCurrentSalary(req.params.userId);
      res.status(200).json(ok(currentSalary));
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (
    req: Request<SalaryParamsInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const history = await this.service.getSalaryHistory(req.params.userId);
      res.status(200).json(ok(history));
    } catch (error) {
      next(error);
    }
  };

  upsertCurrent = async (
    req: Request<SalaryParamsInput, unknown, SalaryUpsertInputShape>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;

      if (!req.params.userId) {
        throw new AppError("VALIDATION_ERROR", "userId is required", 400);
      }

      const saved = await this.service.upsertCurrentSalary({
        userId: req.params.userId,
        monthlySalary: body.monthlySalary,
        currency: body.currency,
        paydayDay: body.paydayDay,
        effectiveFrom: body.effectiveFrom,
        effectiveTo: body.effectiveTo || null,
        isActive: body.isActive,
      });

      res.status(200).json(ok(saved));
    } catch (error) {
      next(error);
    }
  };
}
