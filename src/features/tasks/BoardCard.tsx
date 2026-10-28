import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSearchParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import type { Task, Member } from '../../shared/types/models';
import { PRIORITIES, PRIORITY_COLORS } from '../../shared/lib/constants';
import { formatDate, faNumber, isOverdue } from '../../shared/lib/dates';
export default function BoardCard({ task, member }: { task: Task; member?: Member }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  });
  const [, setParams] = useSearchParams();
  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      sx={{ boxShadow: '0 2px 5px #132b2405', touchAction: 'auto' }}
    >
      <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip
            size="small"
            label={PRIORITIES[task.priority]}
            color={PRIORITY_COLORS[task.priority]}
          />
          <IconButton
            {...attributes}
            {...listeners}
            size="small"
            aria-label={`جابه‌جایی ${task.title}`}
            sx={{ cursor: 'grab', touchAction: 'none' }}
          >
            <DragIndicatorRounded sx={{ fontSize: 17 }} />
          </IconButton>
        </Stack>
        <Button
          onClick={() => setParams({ task: task.id })}
          sx={{
            color: 'text.primary',
            p: 0,
            my: 1.3,
            minHeight: 0,
            justifyContent: 'start',
            textAlign: 'start',
            fontSize: 13,
            lineHeight: 1.9,
          }}
        >
          {task.title}
        </Button>
        {task.tags.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.5} mb={1.5}>
            {task.tags.slice(0, 3).map((tag) => (
              <Typography
                key={tag}
                variant="caption"
                sx={{ color: 'text.secondary', bgcolor: 'action.hover', px: 0.7, borderRadius: 1 }}
              >
                {tag}
              </Typography>
            ))}
          </Stack>
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
          <Stack
            direction="row"
            gap={0.5}
            alignItems="center"
            color={isOverdue(task) ? 'error.main' : 'text.secondary'}
          >
            <CalendarTodayOutlined sx={{ fontSize: 12 }} />
            <Typography fontSize={10}>{formatDate(task.dueDate)}</Typography>
          </Stack>
          {member && (
            <Avatar
              title={member.name}
              sx={{ width: 25, height: 25, bgcolor: member.color, fontSize: 10 }}
            >
              {member.name[0]}
            </Avatar>
          )}
        </Stack>
        {task.checklist.length > 0 && (
          <Stack direction="row" alignItems="center" gap={0.5} mt={1} color="text.secondary">
            <CheckBoxOutlined sx={{ fontSize: 13 }} />
            <Typography fontSize={10}>
              {faNumber(task.checklist.filter((c) => c.done).length)}/
              {faNumber(task.checklist.length)}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
