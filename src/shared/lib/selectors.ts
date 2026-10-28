import type { Workspace, Task } from '../types/models';
export const liveMembers = (data: Workspace) => data.members.filter((m) => !m.deletedAt);
export const liveProjects = (data: Workspace) =>
  data.projects.filter((p) => !p.deletedAt && !p.archived);
export const liveTasks = (data: Workspace) => {
  const projects = new Set(liveProjects(data).map((p) => p.id));
  return data.tasks.filter((t) => !t.deletedAt && !t.archived && projects.has(t.projectId));
};
export const projectProgress = (tasks: Task[]) =>
  tasks.length
    ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
    : 0;
export const trackedMinutes = (tasks: Task[]) =>
  tasks.reduce((sum, t) => sum + t.timeEntries.reduce((s, e) => s + e.minutes, 0), 0);
export const normalizeSearch = (text: string) =>
  text.replaceAll('ي', 'ی').replaceAll('ك', 'ک').toLocaleLowerCase().trim();
export function dependencyError(task: Task, all: Task[]): string | null {
  if (task.dependencies.includes(task.id)) return 'تسک نمی‌تواند پیش‌نیاز خودش باشد.';
  const walk = (current: string, visited: Set<string>): boolean => {
    if (current === task.id) return true;
    if (visited.has(current)) return false;
    visited.add(current);
    return (all.find((t) => t.id === current)?.dependencies ?? []).some((d) => walk(d, visited));
  };
  return task.dependencies.some((d) => walk(d, new Set()))
    ? 'این پیش‌نیاز یک چرخه ایجاد می‌کند.'
    : null;
}
