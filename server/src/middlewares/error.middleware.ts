import type { ErrorRequestHandler } from "express";
import { AppError } from "../shared/errors/app-error";
import { logger } from "../config/logger";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = error instanceof AppError ? error : new AppError("INTERNAL_ERROR", "Unexpected server error", 500);

  logger.error(
    {
      err: error,
      code: appError.code,
    },
    "request failed",
  );

  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
    },
  });
};
