import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import { alpha } from '@mui/material/styles';
import type { Project } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { liveTasks, projectProgress } from '../../shared/lib/selectors';
import { PROJECT_STATUSES } from '../../shared/lib/constants';
import { faNumber, formatDate } from '../../shared/lib/dates';
import EntityMenu from '../../shared/ui/EntityMenu';
import { useFeedback } from '../../shared/ui/useFeedback';
export default function ProjectCard({
  project: p,
  onEdit,
}: {
  project: Project;
  onEdit: () => void;
}) {
  const data = useWorkspace((s) => s.data);
  const save = useWorkspace((s) => s.save);
  const remove = useWorkspace((s) => s.remove);
  const { run, confirm } = useFeedback();
  const tasks = liveTasks(data).filter((t) => t.projectId === p.id);
  const progress = projectProgress(tasks);
  const members = data.members.filter((m) => !m.deletedAt && p.memberIds.includes(m.id));
  return (
    <Card
      sx={{ transition: '.2s', '&:hover': { borderColor: p.color, transform: 'translateY(-2px)' } }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: alpha(p.color, 0.1),
              color: p.color,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <FolderOutlined />
          </Box>
          <EntityMenu
            label={p.name}
            onEdit={onEdit}
            onArchive={() =>
              run(
                () => save('project', { ...p, archived: !p.archived }),
                'وضعیت بایگانی تغییر کرد.',
              )
            }
            archived={p.archived}
            onDelete={() =>
              confirm({
                title: 'حذف پروژه؟',
                message:
                  'پروژه و تسک‌های زیرمجموعه از فضای فعال پنهان می‌شوند. امکان بازیابی از تنظیمات وجود دارد.',
                danger: true,
                onConfirm: () => remove('project', p.id),
              })
            }
          />
        </Stack>
        <Typography
          component={Link}
          to={`/projects/${p.id}`}
          variant="h6"
          fontWeight={750}
          display="block"
          mb={0.7}
        >
          {p.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{
            height: 46,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {p.description || 'هنوز توضیحی برای این پروژه ثبت نشده است.'}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
          <Chip
            size="small"
            label={p.archived ? 'بایگانی' : PROJECT_STATUSES[p.status]}
            variant="outlined"
            color={
              p.status === 'completed' ? 'success' : p.status === 'active' ? 'primary' : 'default'
            }
          />
          <Typography variant="caption" color="text.secondary">
            {data.members.find((m) => m.id === p.leadId)?.name || 'بدون سرپرست'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="caption" color="text.secondary">
            {faNumber(tasks.filter((t) => t.status === 'done').length)} از {faNumber(tasks.length)}{' '}
            تسک
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            {faNumber(progress)}٪
          </Typography>
        </Stack>
        <LinearProgress
          value={progress}
          variant="determinate"
          sx={{
            height: 5,
            borderRadius: 5,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': { bgcolor: p.color },
          }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2.5}>
          <AvatarGroup
            max={4}
            sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 11 } }}
          >
            {members.map((m) => (
              <Avatar title={m.name} key={m.id} sx={{ bgcolor: m.color }}>
                {m.name[0]}
              </Avatar>
            ))}
          </AvatarGroup>
          <Stack direction="row" gap={0.7} alignItems="center" color="text.secondary">
            <CalendarTodayOutlined sx={{ fontSize: 13 }} />
            <Typography variant="caption">{formatDate(p.dueDate)}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
