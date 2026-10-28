import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import type { Task } from '../../shared/types/models';
import { taskFields } from '../../shared/lib/schemas';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import { newTask } from './task-defaults';
import TaskMainFields from './TaskMainFields';
import TaskAssignmentFields from './TaskAssignmentFields';
export default function TaskForm({
  task,
  projectId,
  onClose,
}: {
  task?: Task;
  projectId?: string;
  onClose: () => void;
}) {
  const save = useWorkspace((s) => s.save);
  const { run, confirm } = useFeedback();
  const [initial] = useState(() => task ?? newTask(projectId));
  const existing = useWorkspace((s) => s.data.tasks.some((t) => t.id === initial.id));
  const methods = useForm<z.infer<typeof taskFields>>({
    resolver: zodResolver(taskFields),
    defaultValues: initial,
  });
  const close = () =>
    methods.formState.isDirty
      ? confirm({
          title: 'بستن فرم؟',
          message: 'تغییرات ذخیره‌نشده کنار گذاشته می‌شوند.',
          onConfirm: onClose,
        })
      : onClose();
  return (
    <Dialog open onClose={close} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((values) => {
            if (run(() => save('task', { ...initial, ...values }), 'تسک ذخیره شد.')) onClose();
          })}
        >
          <DialogTitle>{existing ? 'ویرایش تسک' : 'تسک جدید'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} mt={1}>
              <TaskAssignmentFields taskId={task?.id} />
              <TaskMainFields />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>انصراف</Button>
            <Button variant="contained" type="submit">
              ذخیرهٔ تسک
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
