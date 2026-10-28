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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import type { Member } from '../../shared/types/models';
import { memberFields } from '../../shared/lib/schemas';
import { baseEntity, COLORS } from '../../shared/lib/constants';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import ColorField from '../../shared/ui/ColorField';
export default function MemberForm({ member, onClose }: { member?: Member; onClose: () => void }) {
  const save = useWorkspace((s) => s.save);
  const { run } = useFeedback();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof memberFields>>({
    resolver: zodResolver(memberFields),
    defaultValues: member ?? { name: '', role: '', email: '', color: COLORS[0], active: true },
  });
  const { confirm } = useFeedback();
  const close = () =>
    isDirty
      ? confirm({
          title: 'بستن فرم؟',
          message: 'تغییرات ذخیره‌نشده کنار گذاشته می‌شوند.',
          action: 'کنارگذاشتن تغییرات',
          onConfirm: onClose,
        })
      : onClose();
  return (
    <Dialog open onClose={close} fullWidth maxWidth="xs">
      <form
        onSubmit={handleSubmit((values) => {
          if (
            run(() => save('member', { ...(member ?? baseEntity()), ...values }), 'عضو ذخیره شد.')
          )
            onClose();
        })}
      >
        <DialogTitle>{member ? 'ویرایش عضو' : 'عضو جدید'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1}>
            <TextField
              autoFocus
              label="نام و نام خانوادگی"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField label="تخصص یا سمت" {...register('role')} />
            <TextField
              label="ایمیل (اختیاری)"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ htmlInput: { dir: 'ltr' } }}
            />
            <Controller
              name="color"
              control={control}
              render={({ field }) => <ColorField {...field} />}
            />
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="عضو فعال"
                  control={<Switch checked={field.value} onChange={(_, v) => field.onChange(v)} />}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>انصراف</Button>
          <Button type="submit" variant="contained">
            ذخیرهٔ عضو
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
