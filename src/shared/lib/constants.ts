import type { Priority, ProjectStatus, TaskStatus } from '../types/models';
export const STATUSES: Record<TaskStatus, string> = {
  todo: 'برای انجام',
  progress: 'در حال انجام',
  review: 'در بررسی',
  done: 'انجام‌شده',
};
export const PRIORITIES: Record<Priority, string> = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد',
  urgent: 'فوری',
};
export const PROJECT_STATUSES: Record<ProjectStatus, string> = {
  planned: 'برنامه‌ریزی',
  active: 'فعال',
  paused: 'متوقف',
  completed: 'تکمیل‌شده',
};
export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: '#7b8794',
  progress: '#3978d0',
  review: '#ad7b25',
  done: '#218a6a',
};
export const PRIORITY_COLORS: Record<Priority, 'default' | 'info' | 'warning' | 'error'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
};
export const COLORS = ['#176b58', '#4267b2', '#8b5bb4', '#bc6c35', '#bd5272', '#418a99'];
export const id = () => crypto.randomUUID();
export const nowISO = () => new Date().toISOString();
export const baseEntity = () => ({
  id: id(),
  createdAt: nowISO(),
  updatedAt: nowISO(),
  deletedAt: null,
});
