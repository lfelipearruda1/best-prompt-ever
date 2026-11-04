import { Router } from "express";
import { OrderRepository } from "../repositories/OrderRepository";
import { ordersToCsv } from "../export/ordersCsv";

export function ordersRouter(repo: OrderRepository) {
  const router = Router();
  router.get("/orders", async (req, res) => res.json(await repo.list(Number(req.query.limit) || 50)));
  router.get("/orders.csv", async (_req, res) => {
    res.type("text/csv").send(ordersToCsv(await repo.list(1000)));
  });
  return router;
}
