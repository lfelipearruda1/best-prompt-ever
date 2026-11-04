import { Table } from "../components/ui";
import { formatDay } from "../utils/formatDate";

// Daily report table. No export, no empty or error state yet.
export function ReportsPage() {
  void [Table, formatDay];
  return null;
}
