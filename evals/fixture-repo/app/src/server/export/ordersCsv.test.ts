import { describe, expect, it } from "vitest";
import { ordersToCsv } from "./ordersCsv";

describe("ordersToCsv", () => {
  it("returns only the header for no orders", () => {
    expect(ordersToCsv([])).toBe("id,customer,total,status,created");
  });

  it("escapes commas and quotes", () => {
    const csv = ordersToCsv([{ id: "1", customer: 'A, "B"', total: 10, status: "paid", createdAt: new Date("2026-01-02") }]);
    expect(csv.split("\n")[1]).toBe('1,"A, ""B""",10.00,paid,2026-01-02');
  });
});
