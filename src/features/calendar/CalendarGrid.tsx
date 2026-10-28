import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
} from 'date-fns-jalali';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import type { Task } from '../../shared/types/models';
import { localDate, faNumber, today, formatDate } from '../../shared/lib/dates';
import { STATUS_COLORS } from '../../shared/lib/constants';
interface Props {
  month: Date;
  tasks: Task[];
  selected: string;
  onSelect: (day: string) => void;
  onOpen: (id: string) => void;
}
export default function CalendarGrid({ month, tasks, selected, onSelect, onOpen }: Props) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 6 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 6 });
  const days: Date[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);
  const byDate = new Map<string, Task[]>();
  for (const task of tasks) {
    const list = byDate.get(task.dueDate) ?? [];
    list.push(task);
    byDate.set(task.dueDate, list);
  }
  return (
    <Card sx={{ overflow: 'auto' }}>
      <Box sx={{ minWidth: 620 }}>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', bgcolor: 'action.hover' }}
        >
          {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map((d) => (
            <Typography key={d} textAlign="center" py={1.5} fontSize={11} color="text.secondary">
              {d}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {days.map((day) => {
            const iso = localDate(day);
            const dayTasks = byDate.get(iso) ?? [];
            return (
              <Box
                key={iso}
                sx={{
                  minHeight: 105,
                  p: 1,
                  borderTop: '1px solid',
                  borderInlineEnd: '1px solid',
                  borderColor: 'divider',
                  bgcolor: selected === iso ? 'action.selected' : 'transparent',
                  opacity: isSameMonth(day, month) ? 1 : 0.4,
                }}
              >
                <IconButton
                  aria-label={`روز ${formatDate(iso)}`}
                  onClick={() => onSelect(iso)}
                  sx={{
                    width: 27,
                    height: 27,
                    fontSize: 12,
                    bgcolor: iso === today() ? 'primary.main' : 'transparent',
                    color: iso === today() ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  {faNumber(+format(day, 'd'))}
                </IconButton>
                {dayTasks.slice(0, 2).map((t) => (
                  <Box
                    key={t.id}
                    component="button"
                    onClick={() => onOpen(t.id)}
                    sx={{
                      display: 'block',
                      border: 0,
                      borderInlineStart: `2px solid ${STATUS_COLORS[t.status]}`,
                      bgcolor: 'action.hover',
                      color: 'text.primary',
                      fontSize: 10,
                      width: '100%',
                      textAlign: 'start',
                      mt: 0.5,
                      px: 0.5,
                      py: 0.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                    }}
                  >
                    {t.title}
                  </Box>
                ))}
                {dayTasks.length > 2 && (
                  <Typography fontSize={9} color="primary.main">
                    {faNumber(dayTasks.length - 2)} کار دیگر
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
