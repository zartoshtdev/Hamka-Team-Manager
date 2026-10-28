import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddRounded from '@mui/icons-material/AddRounded';
import type { Task, TaskStatus, Member } from '../../shared/types/models';
import { STATUSES, STATUS_COLORS } from '../../shared/lib/constants';
import { faNumber } from '../../shared/lib/dates';
import BoardCard from './BoardCard';
export default function BoardColumn({
  status,
  tasks,
  members,
  onAdd,
}: {
  status: TaskStatus;
  tasks: Task[];
  members: Member[];
  onAdd: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        bgcolor: isOver ? 'action.selected' : 'action.hover',
        border: '1px solid',
        borderColor: isOver ? 'primary.main' : 'transparent',
        p: 1.5,
        borderRadius: 3,
        minWidth: 245,
        flex: 1,
        minHeight: 400,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={{ width: 7, height: 7, bgcolor: STATUS_COLORS[status], borderRadius: '50%' }} />
          <Typography fontSize={13} fontWeight={700}>
            {STATUSES[status]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {faNumber(tasks.length)}
          </Typography>
        </Stack>
        <IconButton size="small" aria-label={`افزودن به ${STATUSES[status]}`} onClick={onAdd}>
          <AddRounded fontSize="small" />
        </IconButton>
      </Stack>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <Stack spacing={1.5}>
          {tasks.map((task) => (
            <BoardCard
              key={task.id}
              task={task}
              member={members.find((m) => m.id === task.assigneeId)}
            />
          ))}
        </Stack>
      </SortableContext>
      {!tasks.length && (
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
          sx={{ py: 5, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}
        >
          تسکی در این ستون نیست
        </Typography>
      )}
    </Box>
  );
}
