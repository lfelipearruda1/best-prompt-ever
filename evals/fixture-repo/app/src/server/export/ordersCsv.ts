import type { Order } from "../repositories/OrderRepository";

const escape = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

export function ordersToCsv(orders: Order[]): string {
  const header = "id,customer,total,status,created";
  const rows = orders.map((o) =>
    [o.id, escape(o.customer), o.total.toFixed(2), o.status, o.createdAt.toISOString().slice(0, 10)].join(","),
  );
  return [header, ...rows].join("\n");
}
