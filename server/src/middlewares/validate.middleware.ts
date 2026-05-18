import type { Request, RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../shared/errors/app-error";

type ValidateTarget = "body" | "query" | "params";

export function validateMiddleware(schema: ZodTypeAny, target: ValidateTarget = "body"): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(new AppError("VALIDATION_ERROR", "Request validation failed", 400, result.error.flatten().fieldErrors));
    }

    if (target === "body") {
      (req as Request & { body: unknown }).body = result.data;
    }

    return next();
  };
}
