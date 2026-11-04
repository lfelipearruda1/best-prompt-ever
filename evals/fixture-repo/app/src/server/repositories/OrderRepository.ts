import type { Knex } from "knex";

export type Order = { id: string; customer: string; total: number; status: string; createdAt: Date };

export class OrderRepository {
  constructor(private readonly db: Knex) {}

  list(limit = 50, offset = 0): Promise<Order[]> {
    return this.db<Order>("orders").orderBy("createdAt", "desc").limit(limit).offset(offset);
  }

  updateStatus(id: string, status: string): Promise<number> {
    return this.db("orders").where({ id }).update({ status });
  }
}
