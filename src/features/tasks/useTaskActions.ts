import type { Task } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import { baseEntity } from '../../shared/lib/constants';
export function useTaskActions() {
  const save = useWorkspace((s) => s.save);
  const remove = useWorkspace((s) => s.remove);
  const { run, confirm } = useFeedback();
  return {
    patch: (task: Task, patch: Partial<Task>) => run(() => save('task', { ...task, ...patch })),
    archive: (task: Task) =>
      run(() => save('task', { ...task, archived: !task.archived }), 'وضعیت بایگانی تغییر کرد.'),
    duplicate: (task: Task) =>
      run(
        () =>
          save('task', {
            ...task,
            ...baseEntity(),
            title: `${task.title} (کپی)`.slice(0, 200),
            status: 'todo',
            comments: [],
            timeEntries: [],
            checklist: task.checklist.map((c) => ({ ...c, done: false })),
            order: Date.now(),
          }),
        'نسخهٔ مشابه ساخته شد.',
      ),
    remove: (task: Task) =>
      confirm({
        title: 'حذف تسک؟',
        message: `«${task.title}» به سطل زباله منتقل می‌شود.`,
        danger: true,
        onConfirm: () => remove('task', task.id),
      }),
  };
}
