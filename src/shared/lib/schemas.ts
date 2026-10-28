import { z } from 'zod';
const date = z
  .string()
  .refine(
    (v) =>
      !v ||
      (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
        !Number.isNaN(Date.parse(`${v}T12:00:00`)) &&
        new Date(`${v}T12:00:00`).toLocaleDateString('en-CA') === v),
    'تاریخ نامعتبر است.',
  );
const base = z.object({
  id: z.string().min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
});
export const memberFields = z.object({
  name: z.string().trim().min(2, 'نام حداقل دو حرف باشد.').max(80),
  role: z.string().trim().max(100),
  email: z.union([z.email('ایمیل معتبر وارد کنید.'), z.literal('')]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  active: z.boolean(),
});
export const projectFields = z
  .object({
    name: z.string().trim().min(2, 'نام پروژه حداقل دو حرف باشد.').max(120),
    description: z.string().max(5000),
    leadId: z.string(),
    memberIds: z.array(z.string()),
    status: z.enum(['planned', 'active', 'paused', 'completed']),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    startDate: date,
    dueDate: date,
    notes: z.string().max(20000),
    milestones: z.array(
      z.object({
        id: z.string(),
        title: z.string().trim().min(1).max(200),
        dueDate: date,
        done: z.boolean(),
      }),
    ),
    archived: z.boolean(),
  })
  .refine((v) => !v.startDate || !v.dueDate || v.startDate <= v.dueDate, {
    message: 'پایان پروژه باید بعد از شروع آن باشد.',
    path: ['dueDate'],
  });
export const taskFields = z
  .object({
    projectId: z.string().min(1, 'یک پروژه انتخاب کنید.'),
    title: z.string().trim().min(2, 'عنوان حداقل دو حرف باشد.').max(200),
    description: z.string().max(10000),
    assigneeId: z.string(),
    status: z.enum(['todo', 'progress', 'review', 'done']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    startDate: date,
    dueDate: date,
    estimate: z.number().finite().min(0).max(100000),
    tags: z.array(z.string().max(40)).max(20),
    checklist: z.array(
      z.object({ id: z.string(), text: z.string().trim().min(1).max(500), done: z.boolean() }),
    ),
    comments: z.array(
      z.object({
        id: z.string(),
        text: z.string().trim().min(1).max(5000),
        createdAt: z.iso.datetime(),
      }),
    ),
    dependencies: z.array(z.string()),
    timeEntries: z.array(
      z.object({
        id: z.string(),
        minutes: z.number().finite().positive().max(100000),
        note: z.string().max(1000),
        date: date,
      }),
    ),
    order: z.number().finite(),
    archived: z.boolean(),
  })
  .refine((v) => !v.startDate || !v.dueDate || v.startDate <= v.dueDate, {
    message: 'موعد انجام باید بعد از شروع باشد.',
    path: ['dueDate'],
  });
export const memberSchema = base.extend(memberFields.shape);
export const projectSchema = base
  .extend(projectFields.shape)
  .refine((v) => !v.startDate || !v.dueDate || v.startDate <= v.dueDate, {
    message: 'ترتیب تاریخ‌های پروژه نامعتبر است.',
  });
export const taskSchema = base
  .extend(taskFields.shape)
  .refine((v) => !v.startDate || !v.dueDate || v.startDate <= v.dueDate, {
    message: 'ترتیب تاریخ‌های تسک نامعتبر است.',
  });
export const workspaceSchema = z.object({
  version: z.literal(1),
  members: z.array(memberSchema).max(5000),
  projects: z.array(projectSchema).max(5000),
  tasks: z.array(taskSchema).max(50000),
  activities: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        createdAt: z.iso.datetime(),
        kind: z.enum(['member', 'project', 'task', 'system']),
      }),
    )
    .max(1000),
  settings: z.object({
    workspaceName: z.string().trim().min(1).max(80),
    theme: z.enum(['light', 'dark', 'system']),
    compact: z.boolean(),
  }),
  timer: z.object({ taskId: z.string(), startedAt: z.iso.datetime() }).nullable(),
});
