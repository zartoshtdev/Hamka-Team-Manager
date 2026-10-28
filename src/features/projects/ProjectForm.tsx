import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import type { Project } from '../../shared/types/models';
import { projectFields } from '../../shared/lib/schemas';
import { baseEntity, COLORS, PROJECT_STATUSES } from '../../shared/lib/constants';
import { useWorkspace } from '../../shared/lib/store';
import { liveMembers } from '../../shared/lib/selectors';
import { useFeedback } from '../../shared/ui/useFeedback';
import DateField from '../../shared/ui/DateField';
import ColorField from '../../shared/ui/ColorField';
export default function ProjectForm({
  project,
  onClose,
}: {
  project?: Project;
  onClose: () => void;
}) {
  const data = useWorkspace((s) => s.data);
  const save = useWorkspace((s) => s.save);
  const members = liveMembers(data);
  const { run, confirm } = useFeedback();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof projectFields>>({
    resolver: zodResolver(projectFields),
    defaultValues: project ?? {
      name: '',
      description: '',
      leadId: '',
      memberIds: [],
      status: 'planned',
      color: COLORS[0],
      startDate: '',
      dueDate: '',
      notes: '',
      milestones: [],
      archived: false,
    },
  });
  const close = () =>
    isDirty
      ? confirm({
          title: 'بستن فرم؟',
          message: 'تغییرات ذخیره‌نشده کنار گذاشته می‌شوند.',
          onConfirm: onClose,
        })
      : onClose();
  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm">
      <form
        onSubmit={handleSubmit((values) => {
          if (
            run(() => {
              const existingTasks = data.tasks.filter(
                (t) => t.projectId === project?.id && !t.deletedAt,
              );
              if (
                existingTasks.some(
                  (t) =>
                    t.assigneeId &&
                    !values.memberIds.includes(t.assigneeId) &&
                    values.leadId !== t.assigneeId,
                )
              )
                throw new Error(
                  'ابتدا مسئول تسک‌های اعضایی را که از پروژه خارج می‌کنید تغییر دهید.',
                );
              save('project', { ...(project ?? baseEntity()), ...values });
            }, 'پروژه ذخیره شد.')
          )
            onClose();
        })}
      >
        <DialogTitle>{project ? 'ویرایش پروژه' : 'پروژهٔ جدید'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1}>
            <TextField
              autoFocus
              label="نام پروژه"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="توضیحات"
              multiline
              minRows={3}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField select fullWidth label="وضعیت پروژه" {...field}>
                    {Object.entries(PROJECT_STATUSES).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="leadId"
                control={control}
                render={({ field }) => (
                  <TextField select fullWidth label="سرپرست پروژه" {...field}>
                    <MenuItem value="">هنوز مشخص نیست</MenuItem>
                    {members.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>
            {!members.length && (
              <Alert severity="info">
                برای انتخاب سرپرست و مسئول تسک‌ها، ابتدا{' '}
                <Link to="/members" onClick={onClose}>
                  عضو ثبت کنید.
                </Link>
              </Alert>
            )}
            <Controller
              name="memberIds"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={members}
                  getOptionLabel={(m) => m.name}
                  value={members.filter((m) => field.value.includes(m.id))}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  onChange={(_, value) => field.onChange(value.map((m) => m.id))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="اعضای پروژه"
                      helperText="سرپرست به‌صورت خودکار به اعضای پروژه اضافه می‌شود."
                    />
                  )}
                />
              )}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <DateField label="تاریخ شروع" {...field} />}
              />
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateField label="تاریخ پایان" {...field} error={errors.dueDate?.message} />
                )}
              />
            </Stack>
            <Controller
              name="color"
              control={control}
              render={({ field }) => <ColorField {...field} />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>انصراف</Button>
          <Button type="submit" variant="contained">
            ذخیرهٔ پروژه
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
