export type TaskStatus = 'todo' | 'progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planned' | 'active' | 'paused' | 'completed';
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export interface Member extends BaseEntity {
  name: string;
  role: string;
  email: string;
  color: string;
  active: boolean;
}
export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
}
export interface Project extends BaseEntity {
  name: string;
  description: string;
  leadId: string;
  memberIds: string[];
  status: ProjectStatus;
  color: string;
  startDate: string;
  dueDate: string;
  notes: string;
  milestones: Milestone[];
  archived: boolean;
}
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}
export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}
export interface TimeEntry {
  id: string;
  minutes: number;
  note: string;
  date: string;
}
export interface Task extends BaseEntity {
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: Priority;
  startDate: string;
  dueDate: string;
  estimate: number;
  tags: string[];
  checklist: ChecklistItem[];
  comments: Comment[];
  dependencies: string[];
  timeEntries: TimeEntry[];
  order: number;
  archived: boolean;
}
export interface Activity {
  id: string;
  text: string;
  createdAt: string;
  kind: 'project' | 'task' | 'member' | 'system';
}
export interface Settings {
  workspaceName: string;
  theme: 'light' | 'dark' | 'system';
  compact: boolean;
}
export interface Workspace {
  version: 1;
  members: Member[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  settings: Settings;
  timer: { taskId: string; startedAt: string } | null;
}
export type EntityType = 'member' | 'project' | 'task';
