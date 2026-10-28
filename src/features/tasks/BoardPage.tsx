import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import AddRounded from '@mui/icons-material/AddRounded';
import { useWorkspace } from '../../shared/lib/store';
import { liveProjects, liveTasks, normalizeSearch } from '../../shared/lib/selectors';
import { STATUSES } from '../../shared/lib/constants';
import type { Task, TaskStatus } from '../../shared/types/models';
import { useFeedback } from '../../shared/ui/useFeedback';
import PageHeader from '../../shared/ui/PageHeader';
import EmptyState from '../../shared/ui/EmptyState';
import BoardColumn from './BoardColumn';
import TaskForm from './TaskForm';
import { newTask } from './task-defaults';
export default function BoardPage() {
  const data = useWorkspace((s) => s.data);
  const reorder = useWorkspace((s) => s.reorder);
  const projects = liveProjects(data);
  const [selected, setSelected] = useState('');
  const projectId = projects.some((p) => p.id === selected) ? selected : (projects[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [assignee, setAssignee] = useState('all');
  const [form, setForm] = useState<Task | null>(null);
  const { run } = useFeedback();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const tasks = liveTasks(data)
    .filter(
      (t) =>
        t.projectId === projectId &&
        normalizeSearch(t.title + ' ' + t.tags.join(' ')).includes(normalizeSearch(query)) &&
        (assignee === 'all' || t.assigneeId === assignee),
    )
    .sort((a, b) => a.order - b.order);
  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const target = data.tasks.find((t) => t.id === over.id);
    const status = target?.status ?? (over.id as TaskStatus);
    if (!(status in STATUSES)) return;
    run(() => reorder(String(active.id), status, target?.id));
  }
  return (
    <>
      <PageHeader
        title="برد کانبان"
        description="کارها را جابه‌جا کن؛ مسیر پیشرفت را ببین."
        action={
          <Button
            startIcon={<AddRounded />}
            variant="contained"
            disabled={!projectId}
            onClick={() => setForm(newTask(projectId))}
          >
            تسک جدید
          </Button>
        }
      />
      {projects.length ? (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
            <TextField
              select
              label="پروژه"
              value={projectId}
              onChange={(e) => {
                setSelected(e.target.value);
                setAssignee('all');
              }}
              sx={{ minWidth: 230 }}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="جست‌وجوی کارت"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              select
              label="مسئول"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="all">همهٔ اعضا</MenuItem>
              {data.members
                .filter(
                  (m) =>
                    !m.deletedAt &&
                    data.projects.find((p) => p.id === projectId)?.memberIds.includes(m.id),
                )
                .map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
            </TextField>
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block" mb={2}>
            از دستگیرهٔ کارت استفاده کنید. با کیبورد: Space، کلیدهای جهت و دوباره Space.
          </Typography>
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, alignItems: 'stretch' }}>
              {(Object.keys(STATUSES) as TaskStatus[]).map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  tasks={tasks.filter((t) => t.status === status)}
                  members={data.members}
                  onAdd={() => setForm({ ...newTask(projectId), status })}
                />
              ))}
            </Box>
          </DndContext>
        </>
      ) : (
        <Card>
          <EmptyState
            title="اولین برد در انتظار پروژهٔ شماست"
            description="با ساخت پروژه می‌توانید تسک‌ها را بین ستون‌ها جابه‌جا کنید."
            action={
              <Button component={Link} to="/projects?new=1" variant="contained">
                ساخت پروژه
              </Button>
            }
          />
        </Card>
      )}
      {form && <TaskForm task={form} onClose={() => setForm(null)} />}
    </>
  );
}
