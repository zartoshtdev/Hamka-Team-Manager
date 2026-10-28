import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import PendingActionsRounded from '@mui/icons-material/PendingActionsRounded';
import PeopleOutlineRounded from '@mui/icons-material/PeopleOutlineRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import NorthWestRounded from '@mui/icons-material/NorthWestRounded';
import { useWorkspace } from '../../shared/lib/store';
import { liveProjects, liveTasks, liveMembers } from '../../shared/lib/selectors';
import { faNumber, isOverdue, formatDate, today, formatDateTime } from '../../shared/lib/dates';
import StatCard from './StatCard';
import GettingStarted from './GettingStarted';
import DashboardLists from './DashboardLists';
export default function DashboardPage() {
  const data = useWorkspace((s) => s.data);
  const tasks = liveTasks(data);
  const completed = tasks.filter((t) => t.status === 'done').length;
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={800}>
            نمای کلی فضای کار
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.8}>
            امروز را با یک تصویر روشن شروع کن.
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          {formatDate(today())}
        </Typography>
      </Stack>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          bgcolor: '#176b58',
          color: '#fff',
          p: { xs: 3, md: 4 },
          mb: 3,
          minHeight: 200,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 280,
            height: 280,
            border: '1px solid #ffffff15',
            borderRadius: '50%',
            left: -50,
            top: -40,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 35,
              border: '1px solid #ffffff18',
              borderRadius: '50%',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 75,
              border: '1px solid #ffffff20',
              borderRadius: '50%',
            },
          }}
        />
        <NorthWestRounded
          sx={{
            position: 'absolute',
            fontSize: 100,
            left: { xs: 15, md: 90 },
            top: 48,
            opacity: 0.1,
          }}
        />
        <Typography variant="caption" sx={{ color: '#bdd9ce', letterSpacing: 1 }}>
          با هم، منظم‌تر پیش می‌رویم
        </Typography>
        <Typography variant="h5" fontWeight={800} mt={1.2} mb={1}>
          فضایی برای کارهای بزرگ.
        </Typography>
        <Typography variant="body2" sx={{ color: '#d0e8df', maxWidth: 530 }}>
          پروژه‌ها، آدم‌ها و قدم‌های بعدی؛ همه در یک جای روشن و مرتب.
        </Typography>
        <Button
          component={Link}
          to="/projects?new=1"
          startIcon={<AddRounded />}
          variant="contained"
          sx={{ mt: 2.5, bgcolor: '#fff', color: '#176b58', '&:hover': { bgcolor: '#edf6f1' } }}
        >
          شروع یک پروژه
        </Button>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          gap: { xs: 1.5, md: 2.5 },
          mb: 3,
        }}
      >
        <StatCard
          label="پروژه‌ها"
          value={faNumber(liveProjects(data).length)}
          detail={`${faNumber(liveProjects(data).filter((p) => p.status === 'active').length)} پروژهٔ فعال`}
          icon={FolderOutlined}
          color="#4b77bb"
        />
        <StatCard
          label="تسک‌های تکمیل"
          value={faNumber(completed)}
          detail={`از مجموع ${faNumber(tasks.length)} تسک`}
          icon={CheckCircleOutlineRounded}
          color="#218a6a"
        />
        <StatCard
          label="کارهای عقب‌افتاده"
          value={faNumber(tasks.filter(isOverdue).length)}
          detail={`${faNumber(tasks.filter((t) => t.dueDate === today() && t.status !== 'done').length)} کار با موعد امروز`}
          icon={PendingActionsRounded}
          color="#be8d3b"
        />
        <StatCard
          label="اعضای تیم"
          value={faNumber(liveMembers(data).length)}
          detail={`${faNumber(liveMembers(data).filter((m) => m.active).length)} عضو فعال`}
          icon={PeopleOutlineRounded}
          color="#9067b4"
        />
      </Box>
      <GettingStarted data={data} />
      <DashboardLists data={data} />
      {data.activities.length > 0 && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography fontWeight={700}>آخرین تغییرات</Typography>
            <Button component={Link} to="/activity" size="small">
              مشاهدهٔ تاریخچه ←
            </Button>
          </Stack>
          {data.activities.slice(0, 4).map((a) => (
            <Stack key={a.id} direction="row" justifyContent="space-between" gap={2} py={1}>
              <Typography variant="body2">{a.text}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {formatDateTime(a.createdAt)}
              </Typography>
            </Stack>
          ))}
        </Card>
      )}
    </>
  );
}
