import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import ViewKanbanOutlined from '@mui/icons-material/ViewKanbanOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import PeopleOutlineRounded from '@mui/icons-material/PeopleOutlineRounded';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import HistoryRounded from '@mui/icons-material/HistoryRounded';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
export const navigation = [
  { path: '/', label: 'نمای کلی', icon: DashboardOutlined },
  { path: '/projects', label: 'پروژه‌ها', icon: FolderOutlined },
  { path: '/tasks', label: 'همهٔ تسک‌ها', icon: TaskAltOutlined },
  { path: '/board', label: 'برد کانبان', icon: ViewKanbanOutlined },
  { path: '/calendar', label: 'تقویم', icon: CalendarMonthOutlined },
  { path: '/members', label: 'اعضای تیم', icon: PeopleOutlineRounded },
  { path: '/reports', label: 'گزارش‌ها', icon: BarChartRounded },
  { path: '/activity', label: 'تاریخچهٔ فعالیت', icon: HistoryRounded },
  { path: '/settings', label: 'تنظیمات و پشتیبان', icon: SettingsOutlined },
];
