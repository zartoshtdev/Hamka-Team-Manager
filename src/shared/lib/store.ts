import { create } from 'zustand';
import type { EntityType, Member, Project, Task, Workspace, Settings } from '../types/models';
import { emptyWorkspace, loadWorkspace, saveWorkspace, validateWorkspace } from './storage';
import { removeEntity, restoreEntity, upsertEntity } from './entity-actions';
import { id, nowISO } from './constants';
import { today } from './dates';
const initial = loadWorkspace();
interface Store {
  data: Workspace;
  error: string;
  locked: boolean;
  save: (kind: EntityType, value: Member | Project | Task) => void;
  remove: (kind: EntityType, id: string, permanent?: boolean) => void;
  restore: (kind: EntityType, id: string) => void;
  settings: (settings: Settings) => void;
  replace: (value: unknown) => void;
  reset: () => void;
  clearError: () => void;
  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  reorder: (taskId: string, status: Task['status'], targetId?: string) => void;
  batchStatus: (ids: string[], status: Task['status']) => void;
  batchRemove: (ids: string[]) => void;
}
export const useWorkspace = create<Store>((set, get) => {
  function commit(
    data: Workspace,
    text: string,
    kind: 'system' | EntityType = 'system',
    unlock = false,
  ) {
    if (get().locked && !unlock)
      throw new Error(
        'برای محافظت از اطلاعات قبلی، ابتدا از تنظیمات پشتیبان را بازیابی یا بازنشانی کنید.',
      );
    const next = {
      ...data,
      activities: [{ id: id(), text, kind, createdAt: nowISO() }, ...data.activities].slice(0, 500),
    };
    saveWorkspace(next);
    set({ data: next, error: '', locked: false });
  }
  return {
    data: initial.data,
    error: initial.error,
    locked: !!initial.error,
    clearError: () => set({ error: '' }),
    save: (kind, value) => {
      const exists = get().data[
        kind === 'member' ? 'members' : kind === 'project' ? 'projects' : 'tasks'
      ].some((x) => x.id === value.id);
      const updated = { ...value, updatedAt: nowISO() };
      commit(
        upsertEntity(get().data, kind, updated),
        `${exists ? 'ویرایش' : 'ایجاد'} ${kind === 'task' ? 'تسک' : kind === 'project' ? 'پروژه' : 'عضو'} «${'title' in value ? value.title : value.name}»`,
        kind,
      );
    },
    remove: (kind, entityId, permanent = false) =>
      commit(
        removeEntity(get().data, kind, entityId, permanent),
        permanent ? 'حذف دائمی از سطل زباله' : 'انتقال به سطل زباله',
        kind,
      ),
    restore: (kind, entityId) =>
      commit(restoreEntity(get().data, kind, entityId), 'بازیابی از سطل زباله', kind),
    settings: (settings) => commit({ ...get().data, settings }, 'ذخیرهٔ تنظیمات'),
    replace: (value) =>
      commit(validateWorkspace(value), 'بازیابی اطلاعات از فایل پشتیبان', 'system', true),
    reset: () => commit(emptyWorkspace(), 'بازنشانی فضای کار', 'system', true),
    startTimer: (taskId) => {
      const data = get().data;
      if (data.timer) throw new Error('ابتدا زمان‌سنج فعلی را متوقف کنید.');
      if (!data.tasks.some((t) => t.id === taskId && !t.deletedAt && !t.archived))
        throw new Error('تسک موجود نیست.');
      commit({ ...data, timer: { taskId, startedAt: nowISO() } }, 'شروع زمان‌سنج', 'task');
    },
    stopTimer: () => {
      const data = get().data;
      const timer = data.timer;
      if (!timer) return;
      const minutes = Math.max(1, Math.round((Date.now() - Date.parse(timer.startedAt)) / 60000));
      commit(
        {
          ...data,
          timer: null,
          tasks: data.tasks.map((t) =>
            t.id === timer.taskId
              ? {
                  ...t,
                  timeEntries: [
                    ...t.timeEntries,
                    { id: id(), minutes, note: 'ثبت با زمان‌سنج', date: today() },
                  ],
                }
              : t,
          ),
        },
        'ثبت زمان کار',
        'task',
      );
    },
    batchStatus: (ids, status) => {
      const current = get().data;
      let data = {
        ...current,
        tasks: current.tasks.map((t) => (ids.includes(t.id) ? { ...t, status } : t)),
      };
      for (const task of data.tasks.filter((t) => ids.includes(t.id)))
        data = upsertEntity(data, 'task', { ...task, status, updatedAt: nowISO() });
      commit(data, 'تغییر گروهی وضعیت تسک‌ها', 'task');
    },
    batchRemove: (ids) => {
      let data = get().data;
      for (const taskId of ids) data = removeEntity(data, 'task', taskId);
      commit(data, 'حذف گروهی تسک‌ها', 'task');
    },
    reorder: (taskId, status, targetId) => {
      const data = get().data;
      const task = data.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const list = data.tasks
        .filter((t) => t.projectId === task.projectId && t.status === status && t.id !== taskId)
        .sort((a, b) => a.order - b.order);
      let index = targetId ? list.findIndex((t) => t.id === targetId) : list.length;
      if (targetId && task.status === status) {
        const original = data.tasks
          .filter((t) => t.projectId === task.projectId && t.status === status)
          .sort((a, b) => a.order - b.order);
        if (
          original.findIndex((t) => t.id === taskId) < original.findIndex((t) => t.id === targetId)
        )
          index += 1;
      }
      if (index < 0) index = list.length;
      list.splice(index, 0, { ...task, status });
      const ordered = new Map(list.map((t, i) => [t.id, { ...t, order: i }]));
      const next = upsertEntity(data, 'task', { ...task, status });
      commit(
        { ...next, tasks: next.tasks.map((t) => ordered.get(t.id) ?? t) },
        'جابه‌جایی کارت در برد',
        'task',
      );
    },
  };
});
