import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import type { Project } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import { id } from '../../shared/lib/constants';
import { formatDate } from '../../shared/lib/dates';
import DateField from '../../shared/ui/DateField';
export default function Milestones({ project }: { project: Project }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const save = useWorkspace((s) => s.save);
  const { run } = useFeedback();
  return (
    <Card>
      <CardContent>
        <Typography fontWeight={700} mb={2}>
          نقاط عطف
        </Typography>
        {project.milestones.map((m) => (
          <Stack direction="row" alignItems="center" key={m.id}>
            <Checkbox
              checked={m.done}
              inputProps={{ 'aria-label': `تکمیل ${m.title}` }}
              onChange={(_, done) =>
                run(() =>
                  save('project', {
                    ...project,
                    milestones: project.milestones.map((x) => (x.id === m.id ? { ...x, done } : x)),
                  }),
                )
              }
            />
            <Stack flex={1}>
              <Typography variant="body2" sx={{ textDecoration: m.done ? 'line-through' : 'none' }}>
                {m.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(m.dueDate)}
              </Typography>
            </Stack>
            <IconButton
              aria-label={`حذف نقطه عطف ${m.title}`}
              onClick={() =>
                run(() =>
                  save('project', {
                    ...project,
                    milestones: project.milestones.filter((x) => x.id !== m.id),
                  }),
                )
              }
            >
              <DeleteOutlineRounded fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        {!project.milestones.length && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            برای رسیدن به هدف، ایستگاه‌های مشخص بسازید.
          </Typography>
        )}
        <Stack spacing={2} mt={2}>
          <TextField
            label="عنوان نقطهٔ عطف"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 200 }}
          />
          <DateField label="موعد نقطهٔ عطف" value={date} onChange={setDate} />
          <Button
            variant="outlined"
            disabled={!title.trim()}
            onClick={() => {
              if (
                run(() =>
                  save('project', {
                    ...project,
                    milestones: [
                      ...project.milestones,
                      { id: id(), title: title.trim(), dueDate: date, done: false },
                    ],
                  }),
                )
              ) {
                setTitle('');
                setDate('');
              }
            }}
          >
            افزودن نقطهٔ عطف
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
