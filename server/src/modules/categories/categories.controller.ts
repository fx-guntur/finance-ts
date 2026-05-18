import type { NextFunction, Request, Response } from "express";
import { ok } from "../../shared/responses/api-response";
import type { CategoryCreateInputShape, CategoryParamsInput } from "./categories.schema";
import { CategoriesService } from "./categories.service";

export class CategoriesController {
  constructor(private readonly service = new CategoriesService()) {}

  list = async (req: Request<CategoryParamsInput>, res: Response, next: NextFunction) => {
    try {
      const categories = await this.service.list(req.params.userId);
      res.status(200).json(ok(categories));
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request<CategoryParamsInput, unknown, CategoryCreateInputShape>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await this.service.create({
        userId: req.params.userId,
        name: req.body.name,
        type: req.body.type,
        color: req.body.color ?? null,
        iconKey: req.body.iconKey ?? null,
        sortOrder: req.body.sortOrder,
        isSystem: req.body.isSystem,
        isActive: req.body.isActive,
      });

      res.status(201).json(ok(category));
    } catch (error) {
      next(error);
    }
  };
}
