import type { Task } from '../../shared/types/models';
import { baseEntity } from '../../shared/lib/constants';
export const newTask = (projectId = ''): Task => ({
  ...baseEntity(),
  projectId,
  title: '',
  description: '',
  assigneeId: '',
  status: 'todo',
  priority: 'medium',
  startDate: '',
  dueDate: '',
  estimate: 0,
  tags: [],
  checklist: [],
  comments: [],
  dependencies: [],
  timeEntries: [],
  order: Date.now(),
  archived: false,
});
