import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { CategoriesController } from "./categories.controller";
import { categoryCreateSchema, categoryParamsSchema } from "./categories.schema";

const controller = new CategoriesController();

export const categoriesRouter = Router();

categoriesRouter.get("/:userId", validateMiddleware(categoryParamsSchema, "params"), controller.list);
categoriesRouter.post(
  "/:userId",
  validateMiddleware(categoryParamsSchema, "params"),
  validateMiddleware(categoryCreateSchema, "body"),
  controller.create,
);
