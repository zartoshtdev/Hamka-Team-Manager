import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SearchRounded from '@mui/icons-material/SearchRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import Sidebar from './Sidebar';
const TaskDrawer = lazy(() => import('../features/tasks/TaskDrawer'));
import TimerBanner from './TimerBanner';
import GlobalSearch from './GlobalSearch';
import { navigation } from './navigation';
import { useWorkspace } from '../shared/lib/store';
import { useFeedback } from '../shared/ui/useFeedback';
export default function Layout() {
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const settings = useWorkspace((s) => s.data.settings);
  const saveSettings = useWorkspace((s) => s.settings);
  const error = useWorkspace((s) => s.error);
  const { run } = useFeedback();
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearch((x) => !x);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Box
        component="aside"
        sx={{
          width: 242,
          flexShrink: 0,
          display: { xs: 'none', lg: 'block' },
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          bgcolor: 'background.paper',
          borderInlineEnd: '1px solid',
          borderColor: 'divider',
          zIndex: 1000,
        }}
      >
        <Sidebar onNavigate={() => {}} />
      </Box>
      <Drawer
        open={mobile}
        onClose={() => setMobile(false)}
        anchor="right"
        sx={{ display: { lg: 'none' } }}
        slotProps={{ paper: { sx: { width: 260 } } }}
      >
        <Sidebar onNavigate={() => setMobile(false)} />
      </Drawer>
      <Box sx={{ width: '100%', marginInlineStart: { lg: '242px' }, minWidth: 0 }}>
        <Stack
          component="header"
          direction="row"
          alignItems="center"
          gap={2}
          sx={{
            height: 76,
            px: { xs: 2, md: 4 },
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton
            aria-label="بازکردن منو"
            onClick={() => setMobile(true)}
            sx={{ display: { lg: 'none' } }}
          >
            <MenuRounded />
          </IconButton>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {settings.workspaceName}
            <Box component="span" sx={{ mx: 1.5, color: 'divider' }}>
              /
            </Box>
            <Box component="span" color="text.secondary">
              {navigation.find((n) => n.path === pathname)?.label ?? 'جزئیات پروژه'}
            </Box>
          </Typography>
          <Button
            onClick={() => setSearch(true)}
            startIcon={<SearchRounded />}
            sx={{
              ml: 'auto',
              color: 'text.secondary',
              bgcolor: 'action.hover',
              minWidth: { sm: 160 },
              justifyContent: 'space-between',
              fontWeight: 400,
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              جست‌وجو
            </Box>
            <Box
              component="kbd"
              sx={{ fontSize: 10, opacity: 0.7, ml: 4, display: { xs: 'none', sm: 'inline' } }}
            >
              Ctrl K
            </Box>
          </Button>
          <IconButton
            aria-label="تغییر تم"
            onClick={() =>
              run(() =>
                saveSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' }),
              )
            }
          >
            {settings.theme === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
          <Box
            sx={{
              width: 35,
              height: 35,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
            }}
          >
            {settings.workspaceName[0]}
          </Box>
        </Stack>
        <Box component="main" sx={{ maxWidth: 1560, mx: 'auto', p: { xs: 2, md: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <TimerBanner />
          <Outlet />
        </Box>
        <Box
          component="footer"
          sx={{
            px: 4,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            color: 'text.secondary',
            fontSize: 10,
          }}
        >
          <span>همکار · مدیریت ساده‌تر، همکاری بهتر</span>
          <span>ذخیره‌سازی محلی مرورگر</span>
        </Box>
      </Box>
      <Suspense fallback={null}>{params.has('task') && <TaskDrawer />}</Suspense>
      <GlobalSearch open={search} onClose={() => setSearch(false)} />
    </Box>
  );
}
