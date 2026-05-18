import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router";
import { usersRouter } from "../modules/users/users.router";
import { salariesRouter } from "../modules/salaries/salaries.router";
import { monthlyExpensesRouter } from "../modules/monthly-expenses/monthly-expenses.router";
import { dailyExpensesRouter } from "../modules/daily-expenses/daily-expenses.router";
import { holidaysRouter } from "../modules/holidays/holidays.router";
import { categoriesRouter } from "../modules/categories/categories.router";
import { recommendationsRouter } from "../modules/recommendations/recommendations.router";
import { forecastsRouter } from "../modules/forecasts/forecasts.router";
import { analyticsRouter } from "../modules/analytics/analytics.router";
import { aiRouter } from "../modules/ai/ai.router";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/salaries", salariesRouter);
apiRouter.use("/monthly-expenses", monthlyExpensesRouter);
apiRouter.use("/daily-expenses", dailyExpensesRouter);
apiRouter.use("/holidays", holidaysRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/forecasts", forecastsRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/ai", aiRouter);

