import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import type { Task } from '../../shared/types/models';
import { id } from '../../shared/lib/constants';
import { faNumber } from '../../shared/lib/dates';
import { useTaskActions } from './useTaskActions';
export default function TaskChecklist({ task }: { task: Task }) {
  const [text, setText] = useState('');
  const { patch } = useTaskActions();
  const done = task.checklist.filter((c) => c.done).length;
  const add = () => {
    if (
      text.trim() &&
      patch(task, { checklist: [...task.checklist, { id: id(), text: text.trim(), done: false }] })
    )
      setText('');
  };
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight={700}>چک‌لیست / زیرکارها</Typography>
        <Typography variant="caption" color="text.secondary">
          {faNumber(done)} از {faNumber(task.checklist.length)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={task.checklist.length ? (done / task.checklist.length) * 100 : 0}
        sx={{ height: 5, borderRadius: 5 }}
      />
      {task.checklist.map((c) => (
        <Stack key={c.id} direction="row" alignItems="center">
          <Checkbox
            checked={c.done}
            inputProps={{ 'aria-label': c.text }}
            onChange={(_, done) =>
              patch(task, {
                checklist: task.checklist.map((i) => (i.id === c.id ? { ...i, done } : i)),
              })
            }
          />
          <Typography
            variant="body2"
            flex={1}
            sx={{ textDecoration: c.done ? 'line-through' : 'none' }}
          >
            {c.text}
          </Typography>
          <IconButton
            aria-label={`حذف ${c.text}`}
            onClick={() => patch(task, { checklist: task.checklist.filter((i) => i.id !== c.id) })}
          >
            <DeleteOutlineRounded fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Stack direction="row" gap={1}>
        <TextField
          label="زیرکار جدید"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          fullWidth
          inputProps={{ maxLength: 500 }}
        />
        <Button onClick={add} disabled={!text.trim()}>
          افزودن
        </Button>
      </Stack>
    </Stack>
  );
}
