import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { useWorkspace } from '../../shared/lib/store';
import { projectProgress, trackedMinutes } from '../../shared/lib/selectors';
import { PROJECT_STATUSES } from '../../shared/lib/constants';
import { formatDate, faNumber, duration } from '../../shared/lib/dates';
import PageHeader from '../../shared/ui/PageHeader';
import EmptyState from '../../shared/ui/EmptyState';
import TasksPage from '../tasks/TasksPage';
import ProjectForm from './ProjectForm';
import ProjectNotes from './ProjectNotes';
import Milestones from './Milestones';
export default function ProjectDetailPage() {
  const { id } = useParams();
  const data = useWorkspace((s) => s.data);
  const project = data.projects.find((p) => p.id === id && !p.deletedAt);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState(0);
  if (!project)
    return (
      <EmptyState
        title="پروژه در دسترس نیست"
        description="ممکن است پروژه حذف شده باشد. سطل زباله را در تنظیمات بررسی کنید."
        action={
          <Button component={Link} to="/projects">
            بازگشت به پروژه‌ها
          </Button>
        }
      />
    );
  const tasks = data.tasks.filter((t) => t.projectId === id && !t.deletedAt && !t.archived);
  return (
    <>
      <Button component={Link} to="/projects" sx={{ mb: 1 }}>
        بازگشت به پروژه‌ها
      </Button>
      <PageHeader
        title={project.name}
        description={project.description || 'جزئیات و کارهای پروژه'}
        action={
          <Button startIcon={<EditOutlined />} variant="outlined" onClick={() => setEditing(true)}>
            ویرایش پروژه
          </Button>
        }
      />
      <Stack direction="row" gap={1} mb={3} flexWrap="wrap">
        <Chip
          label={project.archived ? 'بایگانی' : PROJECT_STATUSES[project.status]}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`سرپرست: ${data.members.find((m) => m.id === project.leadId)?.name || 'تعیین نشده'}`}
        />
        <Chip label={`شروع: ${formatDate(project.startDate)}`} />
        <Chip label={`پایان: ${formatDate(project.dueDate)}`} />
      </Stack>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Box flex={1}>
            <Stack direction="row" justifyContent="space-between" mb={1.5}>
              <Typography variant="body2">پیشرفت تسک‌ها</Typography>
              <Typography fontWeight={700}>{faNumber(projectProgress(tasks))}٪</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={projectProgress(tasks)}
              sx={{ height: 7, borderRadius: 4 }}
            />
          </Box>
          <Box sx={{ minWidth: 200, mr: { sm: 5 } }}>
            <Typography variant="body2">
              {faNumber(tasks.length)} تسک ·{' '}
              {faNumber(tasks.filter((t) => t.status === 'done').length)} تکمیل
            </Typography>
            <Typography variant="caption" color="text.secondary">
              زمان ثبت‌شده: {duration(trackedMinutes(tasks))}
            </Typography>
          </Box>
        </Stack>
      </Card>
      <Tabs
        value={tab}
        onChange={(_, tab) => setTab(tab)}
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab label="تسک‌ها" />
        <Tab label="یادداشت‌ها و نقاط عطف" />
        <Tab label="اعضا" />
      </Tabs>
      {tab === 0 &&
        (project.archived ? (
          <Typography color="text.secondary">
            برای مدیریت تسک‌ها، پروژه را از صفحهٔ پروژه‌ها از بایگانی خارج کنید.
          </Typography>
        ) : (
          <TasksPage key={id} projectId={id} embedded />
        ))}
      {tab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: 3 }}>
          <ProjectNotes key={project.id} project={project} />
          <Milestones project={project} />
        </Box>
      )}
      {tab === 2 && (
        <Stack spacing={2}>
          {data.members
            .filter((m) => project.memberIds.includes(m.id) && !m.deletedAt)
            .map((m) => (
              <Card key={m.id} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: m.color }}>{m.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{m.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.role}
                  </Typography>
                </Box>
                {m.id === project.leadId && (
                  <Chip label="سرپرست" size="small" sx={{ ml: 'auto' }} />
                )}
              </Card>
            ))}
          {!project.memberIds.length && (
            <EmptyState
              title="عضوی به پروژه اضافه نشده"
              description="از ویرایش پروژه، اعضای تیم را انتخاب کنید."
              action={<Button onClick={() => setEditing(true)}>ویرایش اعضا</Button>}
            />
          )}
        </Stack>
      )}
      {editing && <ProjectForm project={project} onClose={() => setEditing(false)} />}
    </>
  );
}
