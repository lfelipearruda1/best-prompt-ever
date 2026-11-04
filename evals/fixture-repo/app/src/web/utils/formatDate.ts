// Same as server/utils/date.ts formatOrderDate, copied for the web bundle.
export function formatDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  return day + "/" + month + "/" + date.getFullYear();
}

export const formatDay = (date: Date) => new Intl.DateTimeFormat("en-GB").format(date);
