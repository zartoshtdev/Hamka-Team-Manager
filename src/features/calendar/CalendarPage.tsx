import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addMonths } from 'date-fns-jalali';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { useWorkspace } from '../../shared/lib/store';
import { liveProjects, liveTasks } from '../../shared/lib/selectors';
import { today, formatDate } from '../../shared/lib/dates';
import CalendarGrid from './CalendarGrid';
import PageHeader from '../../shared/ui/PageHeader';
import TaskForm from '../tasks/TaskForm';
import { newTask } from '../tasks/task-defaults';
export default function CalendarPage() {
  const data = useWorkspace((s) => s.data);
  const [, setParams] = useSearchParams();
  const [month, setMonth] = useState(new Date());
  const [project, setProject] = useState('all');
  const [selected, setSelected] = useState(today());
  const [adding, setAdding] = useState(false);
  const projects = liveProjects(data);
  const tasks = liveTasks(data).filter((t) => project === 'all' || t.projectId === project);
  const selectedTasks = tasks.filter((t) => t.dueDate === selected);
  return (
    <>
      <PageHeader title="تقویم کارها" description="یک نگاه به روزها، یک قدم جلوتر از موعدها." />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton aria-label="ماه قبل" onClick={() => setMonth(addMonths(month, -1))}>
            <ChevronRightRounded />
          </IconButton>
          <Typography fontWeight={700} minWidth={130} textAlign="center">
            {new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long' }).format(month)}
          </Typography>
          <IconButton aria-label="ماه بعد" onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronLeftRounded />
          </IconButton>
          <Button
            onClick={() => {
              setMonth(new Date());
              setSelected(today());
            }}
          >
            امروز
          </Button>
        </Stack>
        <TextField
          select
          size="small"
          label="پروژه"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">همهٔ پروژه‌ها</MenuItem>
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <CalendarGrid
        month={month}
        tasks={tasks}
        selected={selected}
        onSelect={setSelected}
        onOpen={(task) => setParams({ task })}
      />
      <Card sx={{ p: 2.5, mt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={700}>کارهای {formatDate(selected)}</Typography>
          <Button disabled={!projects.length} onClick={() => setAdding(true)}>
            افزودن تسک به این روز
          </Button>
        </Stack>
        {selectedTasks.length ? (
          selectedTasks.map((t) => (
            <Button
              fullWidth
              key={t.id}
              sx={{ justifyContent: 'start', color: 'text.primary' }}
              onClick={() => setParams({ task: t.id })}
            >
              {t.title}
            </Button>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            برای این روز تسکی با موعد ثبت نشده است.
          </Typography>
        )}
      </Card>
      {adding && (
        <TaskForm
          task={{ ...newTask(project === 'all' ? projects[0]?.id : project), dueDate: selected }}
          onClose={() => setAdding(false)}
        />
      )}
    </>
  );
}
