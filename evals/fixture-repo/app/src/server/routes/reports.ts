import { Router } from "express";
import { ReportRepository } from "../repositories/ReportRepository";
import { AppError } from "../errors";

export function reportsRouter(repo: ReportRepository) {
  const router = Router();
  router.get("/reports/daily", async (req, res) => {
    const { from, to } = req.query;
    if (typeof from !== "string" || typeof to !== "string") throw new AppError(400, "from and to are required");
    res.json(await repo.daily(from, to));
  });
  return router;
}
