import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import QueryBuilderRounded from '@mui/icons-material/QueryBuilderRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import EventBusyRounded from '@mui/icons-material/EventBusyRounded';
import { useWorkspace } from '../../shared/lib/store';
import {
  liveProjects,
  liveTasks,
  projectProgress,
  trackedMinutes,
} from '../../shared/lib/selectors';
import { duration, faNumber, isOverdue, today } from '../../shared/lib/dates';
import { csv, downloadFile } from '../../shared/lib/storage';
import PageHeader from '../../shared/ui/PageHeader';
import StatCard from '../dashboard/StatCard';
import ReportCharts from './ReportCharts';
export default function ReportsPage() {
  const data = useWorkspace((s) => s.data);
  const [project, setProject] = useState('all');
  const tasks = liveTasks(data).filter((t) => project === 'all' || t.projectId === project);
  const projects = liveProjects(data).filter((p) => project === 'all' || p.id === project);
  const rows = projects.map((p) => {
    const list = tasks.filter((t) => t.projectId === p.id);
    return [
      p.name,
      String(list.length),
      String(list.filter((t) => t.status === 'done').length),
      `${projectProgress(list)}%`,
      String(trackedMinutes(list)),
    ];
  });
  return (
    <>
      <PageHeader
        title="گزارش‌ها و بینش‌ها"
        description="از اطلاعات واقعی فضای کارت، تصویر دقیق‌تری بساز."
        action={
          <Button
            variant="outlined"
            disabled={!rows.length}
            onClick={() =>
              downloadFile(
                `hamkar-report-${today()}.csv`,
                csv([['پروژه', 'تعداد تسک', 'تکمیل', 'پیشرفت', 'زمان ثبت‌شده (دقیقه)'], ...rows]),
                'text/csv;charset=utf-8',
              )
            }
          >
            خروجی گزارش CSV
          </Button>
        }
      />
      <Stack direction="row" mb={3}>
        <TextField
          select
          label="محدودهٔ گزارش"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="all">همهٔ پروژه‌ها</MenuItem>
          {liveProjects(data).map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          label="مجموع تسک‌ها"
          value={faNumber(tasks.length)}
          detail="در محدودهٔ انتخاب‌شده"
          icon={TaskAltRounded}
          color="#4b77bb"
        />
        <StatCard
          label="نرخ تکمیل"
          value={`${faNumber(projectProgress(tasks))}٪`}
          detail="نسبت تسک‌های انجام‌شده"
          icon={TrendingUpRounded}
          color="#218a6a"
        />
        <StatCard
          label="زمان ثبت‌شده"
          value={faNumber(Math.round((trackedMinutes(tasks) / 60) * 10) / 10)}
          detail="ساعت کار ثبت‌شده"
          icon={QueryBuilderRounded}
          color="#9067b4"
        />
        <StatCard
          label="عقب‌افتاده"
          value={faNumber(tasks.filter(isOverdue).length)}
          detail="تسک باز با موعد گذشته"
          icon={EventBusyRounded}
          color="#be8d3b"
        />
      </Box>
      <ReportCharts data={data} tasks={tasks} />
      <Card>
        <TableContainer>
          <Table aria-label="گزارش پروژه‌ها">
            <TableHead>
              <TableRow>
                {['پروژه', 'تعداد تسک', 'تکمیل', 'پیشرفت', 'زمان ثبت‌شده'].map((v) => (
                  <TableCell key={v}>{v}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((p) => {
                const list = tasks.filter((t) => t.projectId === p.id);
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{faNumber(list.length)}</TableCell>
                    <TableCell>
                      {faNumber(list.filter((t) => t.status === 'done').length)}
                    </TableCell>
                    <TableCell>{faNumber(projectProgress(list))}٪</TableCell>
                    <TableCell>{duration(trackedMinutes(list))}</TableCell>
                  </TableRow>
                );
              })}
              {!projects.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    پروژه‌ای برای گزارش وجود ندارد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}
