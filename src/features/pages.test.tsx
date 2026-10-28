import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import Providers from '../app/Providers';
import { useWorkspace } from '../shared/lib/store';
import { loadWorkspace, emptyWorkspace } from '../shared/lib/storage';
import { workspace } from '../test/fixtures';
import DashboardPage from './dashboard/DashboardPage';
import ProjectsPage from './projects/ProjectsPage';
import ProjectForm from './projects/ProjectForm';
import TaskForm from './tasks/TaskForm';
import TasksPage from './tasks/TasksPage';
import BoardPage from './tasks/BoardPage';
import CalendarPage from './calendar/CalendarPage';
import ActivityPage from './activity/ActivityPage';
import SettingsPage from './settings/SettingsPage';
import TrashPanel from './settings/TrashPanel';
import TaskChecklist from './tasks/TaskChecklist';
import TaskComments from './tasks/TaskComments';
import TaskTime from './tasks/TaskTime';
import Milestones from './projects/Milestones';
import ProjectNotes from './projects/ProjectNotes';
import ReportsPage from './reports/ReportsPage';
import { today } from '../shared/lib/dates';
function show(ui: ReactNode) {
  return render(
    <HashRouter>
      <Providers>{ui}</Providers>
    </HashRouter>,
  );
}
beforeEach(() => {
  localStorage.clear();
  window.location.hash = '/';
  useWorkspace.setState({ data: workspace(), error: '', locked: false });
});
describe('feature integration', () => {
  it('renders a zero-data dashboard without invented records', () => {
    useWorkspace.setState({ data: emptyWorkspace() });
    show(<DashboardPage />);
    expect(screen.getByText('از اینجا شروع کن')).toBeInTheDocument();
    expect(screen.getByText('جای پروژهٔ اولت اینجاست')).toBeInTheDocument();
  });
  it('filters actual projects by their names', async () => {
    const user = userEvent.setup();
    show(<ProjectsPage />);
    expect(screen.getByRole('link', { name: 'پروژه آزمون' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('جست‌وجوی پروژه'), 'ناموجود');
    expect(screen.queryByRole('link', { name: 'پروژه آزمون' })).not.toBeInTheDocument();
  });
  it('creates a project with a selected supervisor', async () => {
    const user = userEvent.setup();
    show(<ProjectForm onClose={() => {}} />);
    await user.type(screen.getByLabelText('نام پروژه'), 'محصول جدید');
    await user.click(screen.getByLabelText('سرپرست پروژه'));
    await user.click(screen.getByRole('option', { name: 'عضو آزمون' }));
    await user.click(screen.getByRole('button', { name: 'ذخیرهٔ پروژه' }));
    await waitFor(() => expect(loadWorkspace().data.projects).toHaveLength(2));
    expect(loadWorkspace().data.projects[1].memberIds).toContain('m1');
  });
  it('creates a task with a real project and assignment', async () => {
    const user = userEvent.setup();
    show(<TaskForm projectId="p1" onClose={() => {}} />);
    await user.type(screen.getByLabelText('عنوان تسک'), 'پیاده‌سازی فرم');
    await user.click(screen.getByLabelText('مسئول انجام'));
    await user.click(screen.getByRole('option', { name: 'عضو آزمون' }));
    await user.click(screen.getByRole('button', { name: 'ذخیرهٔ تسک' }));
    await waitFor(() => expect(loadWorkspace().data.tasks).toHaveLength(2));
    expect(loadWorkspace().data.tasks[1].assigneeId).toBe('m1');
  });
  it('filters the task list and opens detail URLs', async () => {
    const user = userEvent.setup();
    show(<TasksPage />);
    await user.click(screen.getByRole('button', { name: 'تسک آزمون' }));
    expect(window.location.hash).toContain('task=t1');
    await user.type(screen.getByLabelText('جست‌وجوی تسک یا برچسب'), 'ناموجود');
    expect(screen.getByText('تسکی برای نمایش وجود ندارد')).toBeInTheDocument();
  });
  it('renders real kanban cards and all four status columns', () => {
    show(<BoardPage />);
    expect(screen.getByRole('button', { name: 'تسک آزمون' })).toBeInTheDocument();
    expect(screen.getByLabelText('جابه‌جایی تسک آزمون')).toBeInTheDocument();
    expect(screen.getByText('در بررسی')).toBeInTheDocument();
  });
  it('places tasks on their actual calendar day', () => {
    const data = workspace();
    data.tasks[0].dueDate = today();
    useWorkspace.setState({ data });
    show(<CalendarPage />);
    expect(screen.getAllByText('تسک آزمون').length).toBeGreaterThan(0);
  });
  it('adds and completes checklist items', async () => {
    const user = userEvent.setup();
    show(<TaskChecklist task={useWorkspace.getState().data.tasks[0]} />);
    await user.type(screen.getByLabelText('زیرکار جدید'), 'بررسی دسترسی');
    await user.click(screen.getByRole('button', { name: 'افزودن' }));
    expect(loadWorkspace().data.tasks[0].checklist[0].text).toBe('بررسی دسترسی');
  });
  it('saves task notes', async () => {
    const user = userEvent.setup();
    show(<TaskComments task={useWorkspace.getState().data.tasks[0]} />);
    await user.type(screen.getByLabelText('یادداشت جدید'), 'تصمیم جلسه');
    await user.click(screen.getByRole('button', { name: 'ثبت یادداشت' }));
    expect(loadWorkspace().data.tasks[0].comments[0].text).toBe('تصمیم جلسه');
  });
  it('adds a manual work-log entry', async () => {
    const user = userEvent.setup();
    show(<TaskTime task={useWorkspace.getState().data.tasks[0]} />);
    await user.type(screen.getByLabelText('دقیقه'), '45');
    await user.click(screen.getByRole('button', { name: 'ثبت دستی زمان' }));
    expect(loadWorkspace().data.tasks[0].timeEntries[0].minutes).toBe(45);
  });
  it('saves a project milestone', async () => {
    const user = userEvent.setup();
    show(<Milestones project={useWorkspace.getState().data.projects[0]} />);
    await user.type(screen.getByLabelText('عنوان نقطهٔ عطف'), 'تحویل نسخهٔ اول');
    await user.click(screen.getByRole('button', { name: 'افزودن نقطهٔ عطف' }));
    expect(loadWorkspace().data.projects[0].milestones[0].title).toBe('تحویل نسخهٔ اول');
  });
  it('saves project notes', async () => {
    const user = userEvent.setup();
    show(<ProjectNotes project={useWorkspace.getState().data.projects[0]} />);
    await user.type(screen.getByLabelText('یادداشت پروژه'), 'هدف پروژه');
    await user.click(screen.getByRole('button', { name: 'ذخیرهٔ یادداشت' }));
    expect(loadWorkspace().data.projects[0].notes).toBe('هدف پروژه');
  });
  it('persists workspace settings', async () => {
    const user = userEvent.setup();
    show(<SettingsPage />);
    const input = screen.getByLabelText('نام فضای کار');
    await user.clear(input);
    await user.type(input, 'تیم طراحی');
    await user.click(screen.getByRole('button', { name: 'ذخیرهٔ تنظیمات' }));
    expect(loadWorkspace().data.settings.workspaceName).toBe('تیم طراحی');
  });
  it('restores a deleted task from trash', async () => {
    const user = userEvent.setup();
    useWorkspace.getState().remove('task', 't1');
    show(<TrashPanel />);
    await user.click(screen.getByRole('button', { name: 'بازیابی' }));
    expect(loadWorkspace().data.tasks[0].deletedAt).toBeNull();
  });
  it('shows only recorded activities', () => {
    useWorkspace
      .getState()
      .settings({ ...useWorkspace.getState().data.settings, workspaceName: 'جدید' });
    show(<ActivityPage />);
    expect(screen.getByText('ذخیرهٔ تنظیمات')).toBeInTheDocument();
  });
  it('renders report summaries from current records', () => {
    const resize = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = resize;
        unobserve = resize;
        disconnect = resize;
      },
    );
    show(<ReportsPage />);
    expect(screen.getByRole('table', { name: 'گزارش پروژه‌ها' })).toBeInTheDocument();
    expect(screen.getByText('پروژه آزمون')).toBeInTheDocument();
  });
  it('refreshes workspace state after a storage event from another tab', () => {
    show(<DashboardPage />);
    const next = emptyWorkspace();
    localStorage.setItem('hamkar.workspace.v1', JSON.stringify(next));
    fireEvent(
      window,
      new StorageEvent('storage', { key: 'hamkar.workspace.v1', storageArea: localStorage }),
    );
    expect(screen.getByText('جای پروژهٔ اولت اینجاست')).toBeInTheDocument();
  });
});
