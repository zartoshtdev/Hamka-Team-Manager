import type { Workspace, EntityType, Member, Project, Task } from '../types/models';
import { memberSchema, projectSchema, taskSchema } from './schemas';
import { dependencyError } from './selectors';
export function upsertEntity(
  data: Workspace,
  kind: EntityType,
  value: Member | Project | Task,
): Workspace {
  if (kind === 'member') {
    const member = memberSchema.parse(value);
    if (
      member.email &&
      data.members.some(
        (m) =>
          !m.deletedAt &&
          m.id !== member.id &&
          m.email.toLowerCase() === member.email.toLowerCase(),
      )
    )
      throw new Error('این ایمیل برای عضو دیگری ثبت شده است.');
    return { ...data, members: replace(data.members, member) };
  }
  if (kind === 'project') {
    const project = projectSchema.parse(value);
    const members = new Set(data.members.filter((m) => !m.deletedAt).map((m) => m.id));
    if (
      (project.leadId && !members.has(project.leadId)) ||
      project.memberIds.some((id) => !members.has(id))
    )
      throw new Error('عضو انتخاب‌شده موجود نیست.');
    if (project.leadId && !project.memberIds.includes(project.leadId))
      project.memberIds.push(project.leadId);
    if (
      data.tasks.some(
        (t) =>
          !t.deletedAt &&
          t.projectId === project.id &&
          t.assigneeId &&
          !project.memberIds.includes(t.assigneeId),
      )
    )
      throw new Error('ابتدا مسئول تسک‌های عضو خارج‌شده از پروژه را تغییر دهید.');
    if (
      project.archived &&
      data.timer &&
      data.tasks.some((t) => t.id === data.timer?.taskId && t.projectId === project.id)
    )
      throw new Error('پیش از بایگانی پروژه، زمان‌سنج را متوقف کنید.');
    return { ...data, projects: replace(data.projects, project) };
  }
  const task = taskSchema.parse(value);
  const project = data.projects.find((p) => p.id === task.projectId && !p.deletedAt && !p.archived);
  if (!project) throw new Error('پروژهٔ فعال برای این تسک وجود ندارد.');
  if (
    task.assigneeId &&
    !data.members.some(
      (m) => m.id === task.assigneeId && !m.deletedAt && project.memberIds.includes(m.id),
    )
  )
    throw new Error('مسئول باید از اعضای پروژه باشد.');
  if (
    task.dependencies.some(
      (id) =>
        !data.tasks.some((t) => t.id === id && t.projectId === task.projectId && !t.deletedAt),
    )
  )
    throw new Error('پیش‌نیاز باید از تسک‌های همین پروژه باشد.');
  if (task.archived && data.timer?.taskId === task.id)
    throw new Error('پیش از بایگانی تسک، زمان‌سنج را متوقف کنید.');
  const previous = data.tasks.find((t) => t.id === task.id);
  if (
    previous &&
    previous.projectId !== task.projectId &&
    data.tasks.some((t) => t.dependencies.includes(task.id))
  )
    throw new Error('ابتدا ارتباط پیش‌نیاز این تسک را از تسک‌های وابسته بردارید.');
  const error = dependencyError(task, data.tasks);
  if (error) throw new Error(error);
  if (
    task.status === 'done' &&
    task.dependencies.some((id) => data.tasks.find((t) => t.id === id)?.status !== 'done')
  )
    throw new Error('ابتدا تسک‌های پیش‌نیاز را تکمیل کنید.');
  return { ...data, tasks: replace(data.tasks, task) };
}
function replace<T extends { id: string }>(list: T[], value: T) {
  return list.some((x) => x.id === value.id)
    ? list.map((x) => (x.id === value.id ? value : x))
    : [...list, value];
}
export function removeEntity(
  data: Workspace,
  kind: EntityType,
  id: string,
  permanent = false,
): Workspace {
  const key = kind === 'member' ? 'members' : kind === 'project' ? 'projects' : 'tasks';
  const stamp = new Date().toISOString();
  let next = {
    ...data,
    [key]: permanent
      ? data[key].filter((e) => e.id !== id)
      : data[key].map((e) => (e.id === id ? { ...e, deletedAt: stamp, updatedAt: stamp } : e)),
  };
  if (kind === 'member')
    next = {
      ...next,
      projects: next.projects.map((p) => ({
        ...p,
        leadId: p.leadId === id ? '' : p.leadId,
        memberIds: p.memberIds.filter((m) => m !== id),
      })),
      tasks: next.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: '' } : t)),
    };
  const removedTasks = new Set(
    kind === 'project'
      ? data.tasks.filter((t) => t.projectId === id).map((t) => t.id)
      : kind === 'task'
        ? [id]
        : [],
  );
  if (kind === 'project' && permanent)
    next = { ...next, tasks: next.tasks.filter((t) => !removedTasks.has(t.id)) };
  next = {
    ...next,
    tasks: next.tasks.map((t) => ({
      ...t,
      dependencies: t.dependencies.filter((d) => !removedTasks.has(d)),
    })),
    timer: next.timer && removedTasks.has(next.timer.taskId) ? null : next.timer,
  };
  return next;
}
export function restoreEntity(data: Workspace, kind: EntityType, id: string): Workspace {
  const key = kind === 'member' ? 'members' : kind === 'project' ? 'projects' : 'tasks';
  if (kind === 'member') {
    const original = data.members.find((m) => m.id === id);
    if (
      original?.email &&
      data.members.some(
        (m) =>
          m.id !== id && !m.deletedAt && m.email.toLowerCase() === original.email.toLowerCase(),
      )
    )
      throw new Error(
        'ایمیل این عضو با عضو فعال دیگری تکراری است. ابتدا ایمیل عضو فعال را تغییر دهید.',
      );
  }

  if (kind === 'task') {
    const task = data.tasks.find((t) => t.id === id);
    if (!data.projects.some((p) => p.id === task?.projectId && !p.deletedAt))
      throw new Error('ابتدا پروژهٔ این تسک را بازیابی کنید.');
  }
  return { ...data, [key]: data[key].map((e) => (e.id === id ? { ...e, deletedAt: null } : e)) };
}
