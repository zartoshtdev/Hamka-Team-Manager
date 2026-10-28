import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Workspace, Task } from '../../shared/types/models';
import { STATUSES, STATUS_COLORS } from '../../shared/lib/constants';
import { faNumber } from '../../shared/lib/dates';
import { liveMembers, trackedMinutes } from '../../shared/lib/selectors';
export default function ReportCharts({ data, tasks }: { data: Workspace; tasks: Task[] }) {
  const theme = useTheme();
  const status = Object.entries(STATUSES)
    .map(([key, name]) => ({
      name,
      value: tasks.filter((t) => t.status === key).length,
      color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
    }))
    .filter((s) => s.value);
  const workload = [
    ...liveMembers(data).map((m) => ({
      name: m.name,
      open: tasks.filter((t) => t.assigneeId === m.id && t.status !== 'done').length,
      done: tasks.filter((t) => t.assigneeId === m.id && t.status === 'done').length,
    })),
    {
      name: 'بدون مسئول',
      open: tasks.filter((t) => !t.assigneeId && t.status !== 'done').length,
      done: tasks.filter((t) => !t.assigneeId && t.status === 'done').length,
    },
  ].filter((m) => m.open + m.done > 0);
  const time = data.projects
    .filter((p) => !p.deletedAt && !p.archived && tasks.some((t) => t.projectId === p.id))
    .map((p) => ({
      name: p.name,
      estimate:
        Math.round(
          (tasks.filter((t) => t.projectId === p.id).reduce((s, t) => s + t.estimate, 0) / 60) * 10,
        ) / 10,
      actual:
        Math.round((trackedMinutes(tasks.filter((t) => t.projectId === p.id)) / 60) * 10) / 10,
    }));
  const chartStyle = {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    borderRadius: 10,
    color: theme.palette.text.primary,
  };
  const axis = { fontSize: 10, fill: theme.palette.text.secondary };
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography fontWeight={700} mb={2}>
          وضعیت تسک‌ها
        </Typography>
        {tasks.length ? (
          <>
            <Box sx={{ width: '100%', height: 230, direction: 'ltr' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={status}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {status.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {status.map((s) => (
                <Typography fontSize={11} key={s.name}>
                  <span style={{ color: s.color }}>● </span>
                  {s.name}: {faNumber(s.value)}
                </Typography>
              ))}
            </Box>
          </>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={10}>
            برای گزارش، تسک ثبت کنید.
          </Typography>
        )}
      </Card>
      <Card sx={{ p: 3 }}>
        <Typography fontWeight={700} mb={2}>
          توزیع کار بین اعضا
        </Typography>
        <Box sx={{ width: '100%', height: 270, direction: 'ltr' }}>
          {workload.length ? (
            <ResponsiveContainer>
              <BarChart data={workload.slice(0, 20)} margin={{ left: -20, right: 10, bottom: 15 }}>
                <CartesianGrid vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="name" tick={axis} interval={0} angle={-15} height={55} />
                <YAxis allowDecimals={false} tick={axis} />
                <Tooltip contentStyle={chartStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="open" name="باز" stackId="a" fill="#6b91c6" />
                <Bar dataKey="done" name="تکمیل" stackId="a" fill="#269576" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography textAlign="center" color="text.secondary" py={10}>
              هنوز کاری ثبت نشده است.
            </Typography>
          )}
        </Box>
        {workload.length > 20 && (
          <Typography variant="caption">نمودار ۲۰ عضو نخست را نشان می‌دهد.</Typography>
        )}
      </Card>
      <Card sx={{ p: 3, gridColumn: { lg: '1 / -1' } }}>
        <Typography fontWeight={700} mb={2}>
          زمان برآوردشده و ثبت‌شدهٔ پروژه‌ها (ساعت)
        </Typography>
        <Box sx={{ height: 260, width: '100%', direction: 'ltr' }}>
          {time.length ? (
            <ResponsiveContainer>
              <BarChart data={time.slice(0, 20)} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="name" tick={axis} />
                <YAxis tick={axis} />
                <Tooltip contentStyle={chartStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="estimate" name="برآورد" fill="#c9d5d0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="ثبت‌شده" fill="#218a6a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography textAlign="center" color="text.secondary" py={10}>
              داده‌ای برای مقایسه وجود ندارد.
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
}
