import type { Member, Project, Task, Workspace } from '../shared/types/models';
import { emptyWorkspace } from '../shared/lib/storage';
const base = {
  createdAt: '2026-10-28T08:00:00.000Z',
  updatedAt: '2026-10-28T08:00:00.000Z',
  deletedAt: null,
};
export const member = (id = 'm1'): Member => ({
  ...base,
  id,
  name: 'عضو آزمون',
  role: 'توسعه‌دهنده',
  email: '',
  color: '#176b58',
  active: true,
});
export const project = (id = 'p1'): Project => ({
  ...base,
  id,
  name: 'پروژه آزمون',
  description: '',
  leadId: 'm1',
  memberIds: ['m1'],
  status: 'active',
  color: '#176b58',
  startDate: '2026-10-01',
  dueDate: '2026-11-01',
  notes: '',
  milestones: [],
  archived: false,
});
export const task = (id = 't1'): Task => ({
  ...base,
  id,
  projectId: 'p1',
  title: 'تسک آزمون',
  description: '',
  assigneeId: 'm1',
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
  order: 0,
  archived: false,
});
export const workspace = (): Workspace => ({
  ...emptyWorkspace(),
  members: [member()],
  projects: [project()],
  tasks: [task()],
});
