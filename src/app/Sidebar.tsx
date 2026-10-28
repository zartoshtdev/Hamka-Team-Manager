import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import HubRounded from '@mui/icons-material/HubRounded';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import { navigation } from './navigation';
import { useWorkspace } from '../shared/lib/store';
import { faNumber } from '../shared/lib/dates';
import { liveProjects, liveTasks } from '../shared/lib/selectors';
export default function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const data = useWorkspace((s) => s.data);
  const counts: Record<string, number> = {
    '/projects': liveProjects(data).length,
    '/tasks': liveTasks(data).length,
  };
  return (
    <Stack sx={{ height: '100%', p: 2.5, overflowY: 'auto' }}>
      <Stack direction="row" spacing={1.4} alignItems="center" sx={{ px: 1, pt: 1, pb: 4 }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2.5,
            width: 42,
            height: 42,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <HubRounded />
        </Box>
        <Box>
          <Typography fontWeight={800} fontSize={24} lineHeight={1.3}>
            همکار<span style={{ color: '#c49859' }}>.</span>
          </Typography>
          <Typography fontSize={10} color="text.secondary" letterSpacing={0.5}>
            یک تیم، یک مسیر
          </Typography>
        </Box>
      </Stack>
      <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, mb: 1 }}>
        فضای مدیریت
      </Typography>
      <Stack spacing={0.65}>
        {navigation.map(({ path, label, icon: Icon }, index) => (
          <Box key={path}>
            {index === 7 && <Divider sx={{ my: 2 }} />}
            <Box
              component={NavLink}
              to={path}
              end={path === '/'}
              onClick={onNavigate}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.3,
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                color: 'text.secondary',
                fontSize: 13,
                fontWeight: 500,
                transition: 'background .15s',
                '&:hover': { bgcolor: 'action.hover' },
                '&.active': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 700,
                },
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
              <span>{label}</span>
              {counts[path] !== undefined && (
                <Box component="span" sx={{ ml: 'auto', fontSize: 11, opacity: 0.85 }}>
                  {faNumber(counts[path])}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 'auto', pt: 4 }}>
        <Box sx={{ p: 1.8, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="caption" fontWeight={700}>
              فضای کار شخصی شما
            </Typography>
          </Stack>
          <Typography fontSize={10.5} color="text.secondary" lineHeight={2} mt={1}>
            اطلاعات در همین مرورگر ذخیره می‌شوند. از تنظیمات پشتیبان بگیرید.
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
