import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from './Layout';
import ErrorBoundary from './ErrorBoundary';
import EmptyState from '../shared/ui/EmptyState';
const Dashboard = lazy(() => import('../features/dashboard/DashboardPage'));
const Projects = lazy(() => import('../features/projects/ProjectsPage'));
const ProjectDetail = lazy(() => import('../features/projects/ProjectDetailPage'));
const Members = lazy(() => import('../features/members/MembersPage'));
const Tasks = lazy(() => import('../features/tasks/TasksPage'));
const Board = lazy(() => import('../features/tasks/BoardPage'));
const Calendar = lazy(() => import('../features/calendar/CalendarPage'));
const Reports = lazy(() => import('../features/reports/ReportsPage'));
const Activity = lazy(() => import('../features/activity/ActivityPage'));
const Settings = lazy(() => import('../features/settings/SettingsPage'));
export default function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <Stack spacing={2} p={4}>
            <Skeleton height={80} />
            <Skeleton height={240} />
            <Skeleton height={240} />
          </Stack>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="members" element={<Members />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="board" element={<Board />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity" element={<Activity />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="*"
              element={
                <EmptyState
                  title="صفحه پیدا نشد"
                  description="از منوی برنامه بخش موردنظر را انتخاب کنید."
                  action={
                    <Button component={Link} to="/">
                      بازگشت به نمای کلی
                    </Button>
                  }
                />
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
