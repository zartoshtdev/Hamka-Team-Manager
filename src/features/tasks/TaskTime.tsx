import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import StopRounded from '@mui/icons-material/StopRounded';
import type { Task } from '../../shared/types/models';
import { id } from '../../shared/lib/constants';
import { duration, today, formatDate } from '../../shared/lib/dates';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import { useTaskActions } from './useTaskActions';
export default function TaskTime({ task }: { task: Task }) {
  const timer = useWorkspace((s) => s.data.timer);
  const start = useWorkspace((s) => s.startTimer);
  const stop = useWorkspace((s) => s.stopTimer);
  const { run } = useFeedback();
  const { patch } = useTaskActions();
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [timer]);
  const active = timer?.taskId === task.id;
  const elapsed = timer ? Math.max(0, Math.floor((clock - Date.parse(timer.startedAt)) / 1000)) : 0;
  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={700}>زمان کار</Typography>
        <Button
          variant={active ? 'contained' : 'outlined'}
          color={active ? 'error' : 'primary'}
          size="small"
          startIcon={active ? <StopRounded /> : <PlayArrowRounded />}
          disabled={!!timer && !active}
          onClick={() => run(() => (active ? stop() : start(task.id)))}
        >
          {active
            ? `توقف · ${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`
            : 'شروع زمان‌سنج'}
        </Button>
      </Stack>
      {timer && !active && <Alert severity="info">زمان‌سنج تسک دیگری فعال است.</Alert>}
      <Typography variant="body2" color="text.secondary">
        ثبت‌شده: {duration(task.timeEntries.reduce((s, e) => s + e.minutes, 0))} · برآورد:{' '}
        {duration(task.estimate)}
      </Typography>
      {task.timeEntries.map((e) => (
        <Stack key={e.id} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">
            {duration(e.minutes)}
            <Typography component="span" variant="caption" color="text.secondary">
              {' '}
              · {formatDate(e.date)} {e.note && `· ${e.note}`}
            </Typography>
          </Typography>
          <IconButton
            aria-label="حذف زمان ثبت‌شده"
            onClick={() =>
              patch(task, { timeEntries: task.timeEntries.filter((x) => x.id !== e.id) })
            }
          >
            <DeleteOutlineRounded fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Stack direction="row" gap={1}>
        <TextField
          label="دقیقه"
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          sx={{ width: 120 }}
          inputProps={{ min: 1, max: 100000 }}
        />
        <TextField
          label="توضیح زمان"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ flex: 1 }}
          inputProps={{ maxLength: 1000 }}
        />
      </Stack>
      <Button
        disabled={!Number.isFinite(+minutes) || +minutes <= 0 || +minutes > 100000}
        onClick={() => {
          if (
            patch(task, {
              timeEntries: [
                ...task.timeEntries,
                { id: id(), minutes: +minutes, note, date: today() },
              ],
            })
          ) {
            setMinutes('');
            setNote('');
          }
        }}
      >
        ثبت دستی زمان
      </Button>
    </Stack>
  );
}
