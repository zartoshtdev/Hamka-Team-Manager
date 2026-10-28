import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import type { Task } from '../../shared/types/models';
import { id, nowISO } from '../../shared/lib/constants';
import { formatDateTime } from '../../shared/lib/dates';
import { useTaskActions } from './useTaskActions';
export default function TaskComments({ task }: { task: Task }) {
  const [text, setText] = useState('');
  const { patch } = useTaskActions();
  return (
    <Stack spacing={2}>
      <Typography fontWeight={700}>یادداشت‌های تسک</Typography>
      {task.comments.map((c) => (
        <Box key={c.id} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(c.createdAt)}
            </Typography>
            <IconButton
              size="small"
              aria-label="حذف یادداشت"
              onClick={() => patch(task, { comments: task.comments.filter((i) => i.id !== c.id) })}
            >
              <DeleteOutlineRounded sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {c.text}
          </Typography>
        </Box>
      ))}
      <TextField
        multiline
        minRows={2}
        label="یادداشت جدید"
        value={text}
        onChange={(e) => setText(e.target.value)}
        inputProps={{ maxLength: 5000 }}
      />
      <Button
        variant="outlined"
        disabled={!text.trim()}
        onClick={() => {
          if (
            patch(task, {
              comments: [...task.comments, { id: id(), text: text.trim(), createdAt: nowISO() }],
            })
          )
            setText('');
        }}
      >
        ثبت یادداشت
      </Button>
    </Stack>
  );
}
