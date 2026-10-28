import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import type { Workspace } from '../../shared/types/models';
import { STATUSES, PRIORITIES } from '../../shared/lib/constants';
import { liveMembers, liveProjects } from '../../shared/lib/selectors';
import { defaultFilters, type Filters } from './task-filters';
export default function TaskFilters({
  data,
  value,
  onChange,
  fixedProject,
}: {
  data: Workspace;
  value: Filters;
  onChange: (value: Filters) => void;
  fixedProject?: boolean;
}) {
  const change = (key: keyof Filters, next: string) => onChange({ ...value, [key]: next });
  return (
    <Stack gap={2} mb={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
        <TextField
          label="جست‌وجوی تسک یا برچسب"
          value={value.query}
          onChange={(e) => change('query', e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        {!fixedProject && (
          <TextField
            select
            label="پروژه"
            value={value.project}
            onChange={(e) => change('project', e.target.value)}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="all">همهٔ پروژه‌ها</MenuItem>
            {liveProjects(data).map((p) => (
              <MenuItem value={p.id} key={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          label="وضعیت"
          value={value.status}
          onChange={(e) => change('status', e.target.value)}
          sx={{ minWidth: 145 }}
        >
          <MenuItem value="all">همهٔ وضعیت‌ها</MenuItem>
          {Object.entries(STATUSES).map(([k, v]) => (
            <MenuItem value={k} key={k}>
              {v}
            </MenuItem>
          ))}
          <MenuItem value="archived">بایگانی</MenuItem>
        </TextField>
        <TextField
          select
          label="اولویت"
          value={value.priority}
          onChange={(e) => change('priority', e.target.value)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="all">همهٔ اولویت‌ها</MenuItem>
          {Object.entries(PRIORITIES).map(([k, v]) => (
            <MenuItem key={k} value={k}>
              {v}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack direction="row" gap={1.5} flexWrap="wrap">
        <TextField
          size="small"
          select
          label="مسئول"
          value={value.assignee}
          onChange={(e) => change('assignee', e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">همهٔ اعضا</MenuItem>
          <MenuItem value="none">بدون مسئول</MenuItem>
          {liveMembers(data).map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="موعد"
          value={value.due}
          onChange={(e) => change('due', e.target.value)}
          sx={{ minWidth: 145 }}
        >
          <MenuItem value="all">تمام موعدها</MenuItem>
          <MenuItem value="today">امروز</MenuItem>
          <MenuItem value="overdue">عقب‌افتاده</MenuItem>
          <MenuItem value="none">بدون موعد</MenuItem>
        </TextField>
        <TextField
          select
          label="مرتب‌سازی"
          value={value.sort}
          onChange={(e) => change('sort', e.target.value)}
          sx={{ minWidth: 145 }}
        >
          <MenuItem value="newest">جدیدترین</MenuItem>
          <MenuItem value="due">نزدیک‌ترین موعد</MenuItem>
          <MenuItem value="priority">اولویت بیشتر</MenuItem>
          <MenuItem value="name">عنوان</MenuItem>
        </TextField>
        <Button
          onClick={() =>
            onChange({ ...defaultFilters, project: fixedProject ? value.project : 'all' })
          }
        >
          پاک‌کردن فیلترها
        </Button>
      </Stack>
    </Stack>
  );
}
