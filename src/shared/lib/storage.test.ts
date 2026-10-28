import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  loadWorkspace,
  saveWorkspace,
  validateWorkspace,
  emptyWorkspace,
  STORAGE_KEY,
  csv,
} from './storage';
import { workspace, task } from '../../test/fixtures';
describe('local persistence and backups', () => {
  beforeEach(() => localStorage.clear());
  it('starts with an empty workspace and no sample records', () =>
    expect(loadWorkspace().data).toEqual(emptyWorkspace()));
  it('round-trips all persisted records', () => {
    const data = workspace();
    saveWorkspace(data);
    expect(loadWorkspace().data).toEqual(data);
  });
  it('preserves the raw data if a stored payload is corrupted', () => {
    localStorage.setItem(STORAGE_KEY, 'broken');
    expect(loadWorkspace().error).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('broken');
  });
  it('rejects unknown backup versions', () =>
    expect(() => validateWorkspace({ ...workspace(), version: 2 })).toThrow());
  it('rejects dangling project references', () => {
    const data = workspace();
    data.tasks[0].projectId = 'missing';
    expect(() => validateWorkspace(data)).toThrow('ارتباط تسک');
  });
  it('rejects duplicate IDs', () => {
    const data = workspace();
    data.tasks.push(task());
    expect(() => validateWorkspace(data)).toThrow('تکراری');
  });
  it('rejects malformed dates', () => {
    const data = workspace();
    data.tasks[0].dueDate = '2026-02-31';
    expect(() => validateWorkspace(data)).toThrow();
  });
  it('rejects invalid time entries', () => {
    const data = workspace();
    data.tasks[0].timeEntries = [{ id: 'time', minutes: -1, note: '', date: '2026-10-28' }];
    expect(() => validateWorkspace(data)).toThrow();
  });
  it('rejects cycles in imported backups', () => {
    const data = workspace();
    data.tasks = [
      { ...task('t1'), dependencies: ['t2'] },
      { ...task('t2'), dependencies: ['t1'] },
    ];
    expect(() => validateWorkspace(data)).toThrow('چرخه');
  });
  it('surfaces quota failures instead of reporting a successful write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });
    expect(() => saveWorkspace(workspace())).toThrow('ذخیره‌سازی');
  });
  it('quotes CSV and neutralizes spreadsheet formulas', () => {
    const output = csv([['=SUM(1,2)', 'متن "آزمون"', 'دو\nخط']]);
    expect(output).toContain('"\'=SUM(1,2)"');
    expect(output).toContain('"متن ""آزمون"""');
    expect(output.startsWith('\uFEFF')).toBe(true);
  });
});
