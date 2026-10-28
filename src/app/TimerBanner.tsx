import { useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useWorkspace } from '../shared/lib/store';
import { useFeedback } from '../shared/ui/useFeedback';
export default function TimerBanner() {
  const timer = useWorkspace((s) => s.data.timer);
  const task = useWorkspace((s) => s.data.tasks.find((t) => t.id === s.data.timer?.taskId));
  const stop = useWorkspace((s) => s.stopTimer);
  const [, setParams] = useSearchParams();
  const { run } = useFeedback();
  return timer ? (
    <Alert
      severity="info"
      sx={{ mb: 3 }}
      action={
        <Stack direction="row">
          <Button onClick={() => setParams({ task: timer.taskId })}>نمایش</Button>
          <Button color="error" onClick={() => run(stop, 'زمان کار ثبت شد.')}>
            توقف و ثبت
          </Button>
        </Stack>
      }
    >
      زمان‌سنج فعال: {task?.title}
    </Alert>
  ) : null;
}
