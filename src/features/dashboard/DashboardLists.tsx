import { Link, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import type { Workspace } from '../../shared/types/models';
import { liveProjects, liveTasks, projectProgress } from '../../shared/lib/selectors';
import { formatDate, faNumber, isOverdue } from '../../shared/lib/dates';
import EmptyState from '../../shared/ui/EmptyState';
export default function DashboardLists({ data }: { data: Workspace }) {
  const [, setParams] = useSearchParams();
  const tasks = liveTasks(data);
  const upcoming = tasks
    .filter((t) => t.status !== 'done' && t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);
  const projects = liveProjects(data).slice(0, 4);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.2fr 1fr' }, gap: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={700}>پروژه‌های در جریان</Typography>
          <Button size="small" component={Link} to="/projects">
            همهٔ پروژه‌ها ←
          </Button>
        </Stack>
        {projects.length ? (
          <Stack spacing={3}>
            {projects.map((p) => {
              const projectTasks = tasks.filter((t) => t.projectId === p.id);
              return (
                <Box key={p.id}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography
                      component={Link}
                      to={`/projects/${p.id}`}
                      fontSize={13}
                      fontWeight={600}
                    >
                      {p.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {faNumber(projectProgress(projectTasks))}٪
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={projectProgress(projectTasks)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': { bgcolor: p.color },
                    }}
                  />
                  <Typography fontSize={10} color="text.secondary" mt={0.8}>
                    {faNumber(projectTasks.length)} تسک · موعد {formatDate(p.dueDate)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <EmptyState
            title="جای پروژهٔ اولت اینجاست"
            description="پیشرفت پروژه‌ها پس از ثبت تسک در این بخش محاسبه می‌شود."
          />
        )}
      </Card>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={700}>موعدهای نزدیک</Typography>
          <Button size="small" component={Link} to="/calendar">
            تقویم ←
          </Button>
        </Stack>
        {upcoming.length ? (
          <Stack spacing={1.5}>
            {upcoming.map((t) => (
              <Box
                key={t.id}
                onClick={() => setParams({ task: t.id })}
                component="button"
                sx={{
                  cursor: 'pointer',
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  textAlign: 'start',
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: isOverdue(t) ? 'error.main' : 'primary.main',
                  }}
                />
                <Box flex={1}>
                  <Typography fontSize={12} fontWeight={600}>
                    {t.title}
                  </Typography>
                  <Typography fontSize={10} color="text.secondary" mt={0.5}>
                    {data.projects.find((p) => p.id === t.projectId)?.name}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={formatDate(t.dueDate)}
                  color={isOverdue(t) ? 'error' : 'default'}
                  variant="outlined"
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState
            title="موعدی ثبت نشده است"
            description="با تعیین موعد تسک‌ها، کارهای نزدیک را اینجا دنبال کنید."
          />
        )}
      </Card>
    </Box>
  );
}
