export const today = () => localDate(new Date());
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(+date) ? null : date;
}
export const formatDate = (value: string) => {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' }).format(
        date,
      )
    : 'بدون موعد';
};
export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('fa-IR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
export const faNumber = (value: number) =>
  new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(value);
export const duration = (minutes: number) =>
  `${faNumber(Math.floor(minutes / 60))} ساعت و ${faNumber(Math.round(minutes % 60))} دقیقه`;
export function isOverdue(task: { dueDate: string; status: string }) {
  return !!task.dueDate && task.dueDate < today() && task.status !== 'done';
}
