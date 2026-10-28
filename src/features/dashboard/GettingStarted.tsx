import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import type { Workspace } from '../../shared/types/models';
import { liveMembers, liveProjects, liveTasks } from '../../shared/lib/selectors';
export default function GettingStarted({ data }: { data: Workspace }) {
  const steps = [
    {
      title: 'تیمت را معرفی کن',
      description: 'ثبت اعضا و تخصص‌ها',
      path: '/members',
      done: liveMembers(data).length > 0,
    },
    {
      title: 'پروژه‌ات را بساز',
      description: 'انتخاب هدف، سرپرست و اعضا',
      path: '/projects?new=1',
      done: liveProjects(data).length > 0,
    },
    {
      title: 'اولین قدم را تعریف کن',
      description: 'ثبت تسک و موعد انجام',
      path: '/tasks',
      done: liveTasks(data).length > 0,
    },
  ];
  if (steps.every((s) => s.done)) return null;
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontWeight={700}>از اینجا شروع کن</Typography>
        <Typography variant="caption" color="text.secondary">
          چند قدم تا یک فضای کار منظم
        </Typography>
      </Stack>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 2 }}
      >
        {steps.map((s, i) => (
          <Box
            component={Link}
            to={s.path}
            key={s.path}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: s.done ? 'primary.main' : 'divider',
              borderRadius: 2.5,
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.main',
                fontSize: 13,
              }}
            >
              {s.done ? (
                <CheckCircleRounded sx={{ fontSize: 19 }} />
              ) : (
                new Intl.NumberFormat('fa').format(i + 1)
              )}
            </Box>
            <Box flex={1}>
              <Typography fontSize={12} fontWeight={700}>
                {s.title}
              </Typography>
              <Typography fontSize={10} color="text.secondary" mt={0.5}>
                {s.description}
              </Typography>
            </Box>
            <ArrowBackRounded sx={{ fontSize: 15, color: 'text.secondary' }} />
          </Box>
        ))}
      </Box>
    </Card>
  );
}
