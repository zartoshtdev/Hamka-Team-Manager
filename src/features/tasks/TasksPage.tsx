import { useState } from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AddRounded from '@mui/icons-material/AddRounded';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import type { Task, TaskStatus } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { liveProjects } from '../../shared/lib/selectors';
import { STATUSES, PRIORITIES } from '../../shared/lib/constants';
import { csv, downloadFile } from '../../shared/lib/storage';
import { faNumber, today } from '../../shared/lib/dates';
import PageHeader from '../../shared/ui/PageHeader';
import EmptyState from '../../shared/ui/EmptyState';
import { useFeedback } from '../../shared/ui/useFeedback';
import TaskFilters from './TaskFilters';
import { defaultFilters } from './task-filters';
import { filterTasks } from './filter-tasks';
import TasksTable from './TasksTable';
import TaskForm from './TaskForm';
export default function TasksPage({
  projectId,
  embedded = false,
}: {
  projectId?: string;
  embedded?: boolean;
}) {
  const data = useWorkspace((s) => s.data);
  const batchStatus = useWorkspace((s) => s.batchStatus);
  const batchRemove = useWorkspace((s) => s.batchRemove);
  const [filters, setFilters] = useState({ ...defaultFilters, project: projectId ?? 'all' });
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState<Task | true | null>(null);
  const { run, confirm } = useFeedback();
  const tasks = filterTasks(data, filters);
  const exportCsv = () =>
    downloadFile(
      `hamkar-tasks-${today()}.csv`,
      csv([
        ['عنوان', 'پروژه', 'مسئول', 'وضعیت', 'اولویت', 'موعد', 'برچسب'],
        ...tasks.map((t) => [
          t.title,
          data.projects.find((p) => p.id === t.projectId)?.name ?? '',
          data.members.find((m) => m.id === t.assigneeId)?.name ?? '',
          STATUSES[t.status],
          PRIORITIES[t.priority],
          t.dueDate,
          t.tags.join('، '),
        ]),
      ]),
      'text/csv;charset=utf-8',
    );
  const add = (
    <Button
      variant="contained"
      startIcon={<AddRounded />}
      disabled={!liveProjects(data).length}
      onClick={() => setForm(true)}
    >
      تسک جدید
    </Button>
  );
  return (
    <>
      {!embedded ? (
        <PageHeader
          title="همهٔ تسک‌ها"
          description="کارهای کوچک امروز، نتیجه‌های بزرگ فردا."
          action={
            <Stack direction="row" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlined />}
                disabled={!tasks.length}
                onClick={exportCsv}
              >
                خروجی CSV
              </Button>
              {add}
            </Stack>
          }
        />
      ) : (
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography fontWeight={700}>تسک‌های پروژه</Typography>
          {add}
        </Stack>
      )}
      <TaskFilters
        data={data}
        value={filters}
        fixedProject={!!projectId}
        onChange={(next) => {
          setFilters(next);
          setSelected([]);
        }}
      />
      {!!selected.length && (
        <Stack direction="row" alignItems="center" gap={2} mb={2} flexWrap="wrap">
          <Typography variant="body2">{faNumber(selected.length)} انتخاب‌شده</Typography>
          <TextField
            select
            size="small"
            label="تغییر گروهی وضعیت"
            value=""
            sx={{ minWidth: 170 }}
            onChange={(e) => {
              if (
                run(
                  () => batchStatus(selected, e.target.value as TaskStatus),
                  'وضعیت تسک‌ها تغییر کرد.',
                )
              )
                setSelected([]);
            }}
          >
            {Object.entries(STATUSES).map(([k, v]) => (
              <MenuItem key={k} value={k}>
                {v}
              </MenuItem>
            ))}
          </TextField>
          <Button
            color="error"
            onClick={() =>
              confirm({
                title: 'حذف گروهی؟',
                message: 'تسک‌های انتخاب‌شده به سطل زباله منتقل می‌شوند.',
                danger: true,
                onConfirm: () => {
                  batchRemove(selected);
                  setSelected([]);
                },
              })
            }
          >
            حذف انتخاب‌شده‌ها
          </Button>
          <Button onClick={() => setSelected([])}>لغو انتخاب</Button>
        </Stack>
      )}
      <Card>
        {tasks.length ? (
          <TasksTable
            tasks={tasks}
            data={data}
            selected={selected}
            onSelect={setSelected}
            onEdit={setForm}
          />
        ) : (
          <EmptyState
            title="تسکی برای نمایش وجود ندارد"
            description={
              liveProjects(data).length
                ? 'اولین تسک را بسازید یا فیلترها را تغییر دهید.'
                : 'برای ثبت تسک ابتدا یک پروژه بسازید.'
            }
            action={
              liveProjects(data).length ? (
                add
              ) : (
                <Button component={Link} to="/projects" variant="contained">
                  رفتن به پروژه‌ها
                </Button>
              )
            }
          />
        )}
      </Card>
      {form && (
        <TaskForm
          task={form === true ? undefined : form}
          projectId={projectId ?? (filters.project === 'all' ? undefined : filters.project)}
          onClose={() => setForm(null)}
        />
      )}
    </>
  );
}
