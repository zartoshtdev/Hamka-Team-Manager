import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useWorkspace } from './store';
import { loadWorkspace } from './storage';
import { task, workspace, member } from '../../test/fixtures';
describe('workspace transactions', () => {
  beforeEach(() => {
    localStorage.clear();
    useWorkspace.setState({ data: workspace(), error: '', locked: false });
  });
  it('persists successful changes and appends activity', () => {
    useWorkspace.getState().save('member', member('m2'));
    expect(loadWorkspace().data.members).toHaveLength(2);
    expect(useWorkspace.getState().data.activities).toHaveLength(1);
  });
  it('keeps the UI state unchanged after a failed storage write', () => {
    const original = useWorkspace.getState().data;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Error('full');
    });
    expect(() => useWorkspace.getState().save('member', member('m2'))).toThrow();
    expect(useWorkspace.getState().data).toBe(original);
  });
  it('locks writes after corrupt storage until explicit recovery', () => {
    useWorkspace.setState({ locked: true });
    expect(() => useWorkspace.getState().save('member', member('m2'))).toThrow('محافظت');
    useWorkspace.getState().replace(workspace());
    expect(useWorkspace.getState().locked).toBe(false);
  });
  it('commits bulk status changes atomically', () => {
    const data = workspace();
    data.tasks.push({ ...task('t2'), dependencies: ['t1'] });
    useWorkspace.setState({ data });
    expect(() => useWorkspace.getState().batchStatus(['t2'], 'done')).toThrow();
    expect(useWorkspace.getState().data.tasks[1].status).toBe('todo');
  });
  it('reorders a card within its status', () => {
    const data = workspace();
    data.tasks.push({ ...task('t2'), order: 1 });
    useWorkspace.setState({ data });
    useWorkspace.getState().reorder('t2', 'todo', 't1');
    const ordered = [...useWorkspace.getState().data.tasks].sort((a, b) => a.order - b.order);
    expect(ordered.map((t) => t.id)).toEqual(['t2', 't1']);
  });
  it('moves a card across columns and saves its status', () => {
    useWorkspace.getState().reorder('t1', 'progress');
    expect(loadWorkspace().data.tasks[0].status).toBe('progress');
  });
  it('allows only one running timer', () => {
    useWorkspace.getState().startTimer('t1');
    expect(() => useWorkspace.getState().startTimer('t1')).toThrow();
  });
  it('records elapsed timer minutes and clears the running timer', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-28T09:00:00Z'));
    useWorkspace.getState().startTimer('t1');
    vi.advanceTimersByTime(125000);
    useWorkspace.getState().stopTimer();
    expect(useWorkspace.getState().data.timer).toBeNull();
    expect(useWorkspace.getState().data.tasks[0].timeEntries[0].minutes).toBe(2);
    vi.useRealTimers();
  });
  it('resets all user records explicitly', () => {
    useWorkspace.getState().reset();
    expect(loadWorkspace().data.tasks).toHaveLength(0);
    expect(loadWorkspace().data.projects).toHaveLength(0);
    expect(loadWorkspace().data.members).toHaveLength(0);
  });
  it('moves a card downward within a status', () => {
    const data = workspace();
    data.tasks.push({ ...task('t2'), order: 1 });
    useWorkspace.setState({ data });
    useWorkspace.getState().reorder('t1', 'todo', 't2');
    expect(
      [...useWorkspace.getState().data.tasks].sort((a, b) => a.order - b.order).map((t) => t.id),
    ).toEqual(['t2', 't1']);
  });
  it('completes selected prerequisites and dependents in one atomic change', () => {
    const data = workspace();
    data.tasks = [{ ...task('t2'), dependencies: ['t1'] }, task('t1')];
    useWorkspace.setState({ data });
    useWorkspace.getState().batchStatus(['t1', 't2'], 'done');
    expect(useWorkspace.getState().data.tasks.every((t) => t.status === 'done')).toBe(true);
  });
});
