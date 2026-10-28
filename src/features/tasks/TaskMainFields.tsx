import { useFormContext, Controller } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import type { z } from 'zod';
import { taskFields } from '../../shared/lib/schemas';
import { STATUSES, PRIORITIES } from '../../shared/lib/constants';
import DateField from '../../shared/ui/DateField';
export default function TaskMainFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof taskFields>>();
  return (
    <>
      <TextField
        autoFocus
        label="عنوان تسک"
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextField
        multiline
        minRows={3}
        label="توضیحات"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField fullWidth select label="وضعیت تسک" {...field}>
              {Object.entries(STATUSES).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <TextField fullWidth select label="اولویت" {...field}>
              {Object.entries(PRIORITIES).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => <DateField label="شروع تسک" {...field} />}
        />
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DateField label="موعد انجام" {...field} error={errors.dueDate?.message} />
          )}
        />
      </Stack>
      <TextField
        type="number"
        label="برآورد زمان (دقیقه)"
        {...register('estimate', { valueAsNumber: true })}
        error={!!errors.estimate}
        helperText={errors.estimate?.message}
        inputProps={{ min: 0, max: 100000 }}
      />
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={field.value}
            onChange={(_, values) =>
              field.onChange([...new Set(values.map((v) => v.trim()).filter(Boolean))])
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="برچسب‌ها"
                helperText={errors.tags?.message ?? 'پس از نوشتن هر برچسب Enter بزنید.'}
                error={!!errors.tags}
              />
            )}
          />
        )}
      />
    </>
  );
}
