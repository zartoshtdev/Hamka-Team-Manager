import type { Workspace } from '../../shared/types/models';
import type { Filters } from './task-filters';
import { normalizeSearch, liveProjects } from '../../shared/lib/selectors';
import { isOverdue, today } from '../../shared/lib/dates';
export function filterTasks(data: Workspace, filters: Filters) {
  const projects = new Set(liveProjects(data).map((p) => p.id));
  const priorities = { urgent: 0, high: 1, medium: 2, low: 3 };
  return data.tasks
    .filter(
      (t) =>
        !t.deletedAt &&
        projects.has(t.projectId) &&
        (filters.status === 'archived'
          ? t.archived
          : !t.archived && (filters.status === 'all' || t.status === filters.status)) &&
        (filters.project === 'all' || t.projectId === filters.project) &&
        (filters.priority === 'all' || t.priority === filters.priority) &&
        (filters.assignee === 'all' ||
          (filters.assignee === 'none' ? !t.assigneeId : t.assigneeId === filters.assignee)) &&
        (filters.due === 'all' ||
          (filters.due === 'today'
            ? t.dueDate === today()
            : filters.due === 'overdue'
              ? isOverdue(t)
              : !t.dueDate)) &&
        normalizeSearch(t.title + ' ' + t.description + ' ' + t.tags.join(' ')).includes(
          normalizeSearch(filters.query),
        ),
    )
    .sort((a, b) =>
      filters.sort === 'priority'
        ? priorities[a.priority] - priorities[b.priority]
        : filters.sort === 'due'
          ? (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
          : filters.sort === 'name'
            ? a.title.localeCompare(b.title, 'fa')
            : b.createdAt.localeCompare(a.createdAt),
    );
}
