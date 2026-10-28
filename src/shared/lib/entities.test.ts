import { describe, it, expect } from 'vitest';
import { upsertEntity, removeEntity, restoreEntity } from './entity-actions';
import { member, project, task, workspace } from '../../test/fixtures';
import { emptyWorkspace } from './storage';
import { liveTasks, projectProgress, trackedMinutes, normalizeSearch } from './selectors';
describe('entity rules', () => {
  it('adds real records without mutating the prior state', () => {
    const data = emptyWorkspace();
    const next = upsertEntity(data, 'member', member());
    expect(data.members).toHaveLength(0);
    expect(next.members[0].name).toBe('عضو آزمون');
  });
  it('updates an existing member rather than duplicating it', () => {
    const data = workspace();
    const next = upsertEntity(data, 'member', { ...member(), name: 'نام تازه' });
    expect(next.members).toHaveLength(1);
    expect(next.members[0].name).toBe('نام تازه');
  });
  it('rejects duplicate emails case-insensitively', () => {
    const data = workspace();
    data.members[0].email = 'User@site.test';
    expect(() =>
      upsertEntity(data, 'member', { ...member('m2'), email: 'user@site.test' }),
    ).toThrow('ایمیل');
  });
  it('includes the supervisor in project membership', () => {
    const data = workspace();
    const next = upsertEntity(data, 'project', { ...project(), memberIds: [] });
    expect(next.projects[0].memberIds).toEqual(['m1']);
  });
  it('rejects references to unknown supervisors', () =>
    expect(() =>
      upsertEntity(workspace(), 'project', { ...project(), leadId: 'missing' }),
    ).toThrow());
  it('rejects task assignment outside a project', () => {
    const data = workspace();
    data.members.push(member('m2'));
    expect(() => upsertEntity(data, 'task', { ...task(), assigneeId: 'm2' })).toThrow(
      'اعضای پروژه',
    );
  });
  it('requires an available project', () =>
    expect(() => upsertEntity(workspace(), 'task', { ...task(), projectId: 'missing' })).toThrow());
  it('prevents completion with unfinished prerequisites', () => {
    const data = workspace();
    data.tasks.push(task('t2'));
    expect(() =>
      upsertEntity(data, 'task', { ...task(), status: 'done', dependencies: ['t2'] }),
    ).toThrow('پیش‌نیاز');
  });
  it('allows completion once prerequisites are done', () => {
    const data = workspace();
    data.tasks.push({ ...task('t2'), status: 'done' });
    expect(
      upsertEntity(data, 'task', { ...task(), status: 'done', dependencies: ['t2'] }).tasks[0]
        .status,
    ).toBe('done');
  });
  it('detects a dependency cycle across multiple tasks', () => {
    const data = workspace();
    data.tasks = [
      { ...task('t1'), dependencies: ['t2'] },
      { ...task('t2'), dependencies: ['t3'] },
      task('t3'),
    ];
    expect(() => upsertEntity(data, 'task', { ...task('t3'), dependencies: ['t1'] })).toThrow(
      'چرخه',
    );
  });
  it('rejects a self dependency', () =>
    expect(() => upsertEntity(workspace(), 'task', { ...task(), dependencies: ['t1'] })).toThrow());
  it('blocks dependencies across projects', () => {
    const data = workspace();
    data.projects.push(project('p2'));
    data.tasks.push({ ...task('t2'), projectId: 'p2' });
    expect(() => upsertEntity(data, 'task', { ...task(), dependencies: ['t2'] })).toThrow();
  });
  it('soft-deletes a project while preserving its tasks for restoration', () => {
    const data = removeEntity(workspace(), 'project', 'p1');
    expect(liveTasks(data)).toHaveLength(0);
    expect(data.tasks).toHaveLength(1);
    expect(liveTasks(restoreEntity(data, 'project', 'p1'))).toHaveLength(1);
  });
  it('permanently deletes project tasks and stops a related timer', () => {
    const original = workspace();
    original.timer = { taskId: 't1', startedAt: original.tasks[0].createdAt };
    const data = removeEntity(original, 'project', 'p1', true);
    expect(data.tasks).toHaveLength(0);
    expect(data.timer).toBeNull();
  });
  it('unassigns deleted members from tasks and supervision', () => {
    const data = removeEntity(workspace(), 'member', 'm1');
    expect(data.projects[0].leadId).toBe('');
    expect(data.projects[0].memberIds).toEqual([]);
    expect(data.tasks[0].assigneeId).toBe('');
  });
  it('cleans dependency links when a task is deleted', () => {
    const data = workspace();
    data.tasks.push({ ...task('t2'), dependencies: ['t1'] });
    expect(removeEntity(data, 'task', 't1').tasks[1].dependencies).toEqual([]);
  });
  it('requires a deleted task parent to be restored first', () => {
    let data = removeEntity(workspace(), 'task', 't1');
    data = removeEntity(data, 'project', 'p1');
    expect(() => restoreEntity(data, 'task', 't1')).toThrow('ابتدا پروژه');
  });
  it('excludes archived projects and tasks from live reports', () => {
    const data = workspace();
    data.projects[0].archived = true;
    expect(liveTasks(data)).toEqual([]);
  });
  it('computes progress and time from actual records', () => {
    const a = task();
    const b = {
      ...task('t2'),
      status: 'done' as const,
      timeEntries: [{ id: 'e1', minutes: 42, note: '', date: '2026-10-28' }],
    };
    expect(projectProgress([a, b])).toBe(50);
    expect(projectProgress([])).toBe(0);
    expect(trackedMinutes([a, b])).toBe(42);
  });
  it('normalizes Arabic and Persian keyboard variations for search', () =>
    expect(normalizeSearch('  كيـف  ')).toBe('کیـف'));
  it('blocks removing a member with assigned tasks from a project', () => {
    const data = workspace();
    expect(() =>
      upsertEntity(data, 'project', { ...project(), leadId: '', memberIds: [] }),
    ).toThrow('مسئول');
  });
  it('blocks archiving a project with an active timer', () => {
    const data = workspace();
    data.timer = { taskId: 't1', startedAt: data.tasks[0].createdAt };
    expect(() => upsertEntity(data, 'project', { ...project(), archived: true })).toThrow(
      'زمان‌سنج',
    );
  });
  it('blocks archiving a timed task until its timer stops', () => {
    const data = workspace();
    data.timer = { taskId: 't1', startedAt: data.tasks[0].createdAt };
    expect(() => upsertEntity(data, 'task', { ...task(), archived: true })).toThrow('زمان‌سنج');
  });
  it('does not move a prerequisite away from dependent tasks', () => {
    const data = workspace();
    data.projects.push(project('p2'));
    data.tasks.push({ ...task('t2'), dependencies: ['t1'] });
    expect(() => upsertEntity(data, 'task', { ...task(), projectId: 'p2' })).toThrow('ارتباط');
  });
  it('rejects restoring a member whose email is now occupied', () => {
    let data = workspace();
    data.members[0].email = 'person@test.dev';
    data = removeEntity(data, 'member', 'm1');
    data.members.push({ ...member('m2'), email: 'person@test.dev' });
    expect(() => restoreEntity(data, 'member', 'm1')).toThrow('تکراری');
  });
});
