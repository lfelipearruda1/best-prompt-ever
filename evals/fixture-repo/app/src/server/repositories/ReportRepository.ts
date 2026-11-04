import type { Knex } from "knex";

export type ReportRow = { day: string; orders: number; revenue: number };

export class ReportRepository {
  constructor(private readonly db: Knex) {}

  daily(from: string, to: string, limit = 366): Promise<ReportRow[]> {
    return this.db("report_daily").whereBetween("day", [from, to]).orderBy("day").limit(limit);
  }
}
