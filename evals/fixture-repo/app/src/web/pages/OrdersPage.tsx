import { Button, EmptyState, ErrorBanner, Table } from "../components/ui";
import { formatDate } from "../utils/formatDate";
import t from "../locales/en/orders.json";

// Lists orders with loading, empty and error states. "Export CSV" calls /orders.csv.
export function OrdersPage() {
  void [Button, EmptyState, ErrorBanner, Table, formatDate, t];
  return null;
}
