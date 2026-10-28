import { useFormContext, Controller, useWatch } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import type { z } from 'zod';
import { taskFields } from '../../shared/lib/schemas';
import { useWorkspace } from '../../shared/lib/store';
import { liveProjects } from '../../shared/lib/selectors';
export default function TaskAssignmentFields({ taskId }: { taskId?: string }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<z.infer<typeof taskFields>>();
  const data = useWorkspace((s) => s.data);
  const projectId = useWatch({ control, name: 'projectId' });
  const project = data.projects.find((p) => p.id === projectId);
  const members = data.members.filter((m) => !m.deletedAt && project?.memberIds.includes(m.id));
  const options = data.tasks.filter(
    (t) => !t.deletedAt && t.projectId === projectId && t.id !== taskId,
  );
  return (
    <>
      <Controller
        name="projectId"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="پروژه"
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
              setValue('assigneeId', '');
              setValue('dependencies', []);
            }}
            error={!!errors.projectId}
            helperText={errors.projectId?.message}
          >
            <MenuItem value="">انتخاب پروژه</MenuItem>
            {liveProjects(data).map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="assigneeId"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="مسئول انجام"
            {...field}
            helperText={!members.length ? 'ابتدا اعضا را به پروژه اضافه کنید.' : undefined}
          >
            <MenuItem value="">بدون مسئول</MenuItem>
            {members.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
                {m.active ? '' : ' (غیرفعال)'}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="dependencies"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={options}
            getOptionLabel={(t) => t.title}
            value={options.filter((t) => field.value.includes(t.id))}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, tasks) => field.onChange(tasks.map((t) => t.id))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="پیش‌نیازها"
                helperText="تکمیل این تسک به انجام پیش‌نیازها وابسته است."
              />
            )}
          />
        )}
      />
    </>
  );
}
