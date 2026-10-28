import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CloseRounded from '@mui/icons-material/CloseRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Alert from '@mui/material/Alert';
import { useWorkspace } from '../../shared/lib/store';
import { STATUSES, PRIORITIES, PRIORITY_COLORS } from '../../shared/lib/constants';
import { formatDate, isOverdue } from '../../shared/lib/dates';
import type { TaskStatus } from '../../shared/types/models';
import TaskForm from './TaskForm';
import TaskChecklist from './TaskChecklist';
import TaskComments from './TaskComments';
import TaskTime from './TaskTime';
import { useTaskActions } from './useTaskActions';
export default function TaskDrawer() {
  const [params, setParams] = useSearchParams();
  const taskId = params.get('task');
  const data = useWorkspace((s) => s.data);
  const task = data.tasks.find((t) => t.id === taskId && !t.deletedAt);
  const [editing, setEditing] = useState(false);
  const { patch } = useTaskActions();
  const close = () => {
    const next = new URLSearchParams(params);
    next.delete('task');
    setParams(next);
  };
  if (!taskId) return null;
  return (
    <Drawer
      anchor="left"
      open
      onClose={close}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 550 }, p: 3, overflowY: 'auto' } } }}
    >
      {task ? (
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Chip label="جزئیات تسک" size="small" />
            <Stack direction="row">
              <Button startIcon={<EditOutlined />} onClick={() => setEditing(true)}>
                ویرایش
              </Button>
              <IconButton aria-label="بستن جزئیات" onClick={close}>
                <CloseRounded />
              </IconButton>
            </Stack>
          </Stack>
          <Box>
            <Typography
              component={Link}
              to={`/projects/${task.projectId}`}
              variant="caption"
              color="primary.main"
            >
              {data.projects.find((p) => p.id === task.projectId)?.name}
            </Typography>
            <Typography variant="h5" fontWeight={800} mt={1} sx={{ overflowWrap: 'anywhere' }}>
              {task.title}
            </Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip
              label={PRIORITIES[task.priority]}
              color={PRIORITY_COLORS[task.priority]}
              variant="outlined"
            />
            {task.tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </Stack>
          {isOverdue(task) && <Alert severity="warning">موعد این تسک گذشته است.</Alert>}
          <TextField
            select
            label="تغییر وضعیت"
            value={task.status}
            onChange={(e) => patch(task, { status: e.target.value as TaskStatus })}
          >
            {Object.entries(STATUSES).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              مسئول: {data.members.find((m) => m.id === task.assigneeId)?.name || 'تعیین نشده'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              موعد: {formatDate(task.dueDate)}
            </Typography>
          </Stack>
          {task.description && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {task.description}
            </Typography>
          )}
          {task.dependencies.length > 0 && (
            <Box>
              <Typography fontWeight={700} mb={1}>
                پیش‌نیازها
              </Typography>
              {task.dependencies.map((d) => {
                const dependency = data.tasks.find((t) => t.id === d);
                return (
                  <Button
                    key={d}
                    size="small"
                    onClick={() => {
                      setParams({ task: d });
                    }}
                  >
                    {dependency?.title} · {dependency?.status === 'done' ? 'انجام‌شده' : 'باز'}
                  </Button>
                );
              })}
            </Box>
          )}
          <Divider />
          <TaskChecklist key={`check-${task.id}`} task={task} />
          <Divider />
          <TaskTime key={`time-${task.id}`} task={task} />
          <Divider />
          <TaskComments key={`comments-${task.id}`} task={task} />
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography>این تسک در دسترس نیست.</Typography>
          <Button onClick={close}>بستن</Button>
        </Stack>
      )}
      {editing && task && <TaskForm key={task.id} task={task} onClose={() => setEditing(false)} />}
    </Drawer>
  );
}
