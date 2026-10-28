import type { Workspace } from '../types/models';
import { workspaceSchema } from './schemas';
import { dependencyError } from './selectors';
export const STORAGE_KEY = 'hamkar.workspace.v1';
export const emptyWorkspace = (): Workspace => ({
  version: 1,
  members: [],
  projects: [],
  tasks: [],
  activities: [],
  settings: { workspaceName: 'فضای کار من', theme: 'light', compact: false },
  timer: null,
});
export function validateWorkspace(value: unknown): Workspace {
  const data = workspaceSchema.parse(value);
  for (const collection of [data.members, data.projects, data.tasks])
    if (new Set(collection.map((e) => e.id)).size !== collection.length)
      throw new Error('شناسهٔ تکراری در فایل وجود دارد.');
  const members = new Set(data.members.map((m) => m.id));
  const projects = new Set(data.projects.map((p) => p.id));
  const tasks = new Set(data.tasks.map((t) => t.id));
  if (
    data.projects.some(
      (p) => (p.leadId && !members.has(p.leadId)) || p.memberIds.some((id) => !members.has(id)),
    )
  )
    throw new Error('ارتباط اعضای پروژه معتبر نیست.');
  if (
    data.tasks.some(
      (t) =>
        !projects.has(t.projectId) ||
        (t.assigneeId && !members.has(t.assigneeId)) ||
        t.dependencies.some((id) => !tasks.has(id)),
    )
  )
    throw new Error('ارتباط تسک‌ها معتبر نیست.');
  if (
    data.tasks.some((t) =>
      t.dependencies.some((id) => data.tasks.find((d) => d.id === id)?.projectId !== t.projectId),
    )
  )
    throw new Error('پیش‌نیازها باید در یک پروژه باشند.');
  if (
    data.tasks.some(
      (t) =>
        t.assigneeId &&
        !data.projects.find((p) => p.id === t.projectId)?.memberIds.includes(t.assigneeId),
    )
  )
    throw new Error('مسئول تسک عضو پروژه نیست.');
  if (data.tasks.some((t) => dependencyError(t, data.tasks)))
    throw new Error('پیش‌نیازهای تسک‌ها چرخه دارند.');
  if (data.timer && !tasks.has(data.timer.taskId)) throw new Error('زمان‌سنج نامعتبر است.');
  return data;
}
export function saveWorkspace(data: Workspace) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error(
      'ذخیره‌سازی انجام نشد؛ فضای مرورگر پر یا دسترسی به آن بسته است. از اطلاعات فعلی پشتیبان بگیرید.',
    );
  }
}
export function loadWorkspace(): { data: Workspace; error: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { data: raw ? validateWorkspace(JSON.parse(raw)) : emptyWorkspace(), error: '' };
  } catch {
    return {
      data: emptyWorkspace(),
      error:
        'اطلاعات ذخیره‌شده قابل خواندن نیست. نسخهٔ اصلی تغییر نکرده است؛ از تنظیمات بازیابی کنید.',
    };
  }
}
export function downloadFile(name: string, content: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csv(rows: string[][]) {
  return (
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map(
            (cell) =>
              '"' + (/^[=+@\-\t\r]/.test(cell) ? "'" : '') + cell.replaceAll('"', '""') + '"',
          )
          .join(','),
      )
      .join('\r\n')
  );
}
