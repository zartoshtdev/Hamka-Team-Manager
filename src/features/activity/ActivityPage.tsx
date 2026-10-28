import { useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useWorkspace } from '../../shared/lib/store';
import { formatDateTime } from '../../shared/lib/dates';
import { normalizeSearch } from '../../shared/lib/selectors';
import PageHeader from '../../shared/ui/PageHeader';
import EmptyState from '../../shared/ui/EmptyState';
export default function ActivityPage() {
  const activities = useWorkspace((s) => s.data.activities);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [limit, setLimit] = useState(50);
  const filtered = activities.filter(
    (a) =>
      (kind === 'all' || a.kind === kind) &&
      normalizeSearch(a.text).includes(normalizeSearch(query)),
  );
  return (
    <>
      <PageHeader title="تاریخچهٔ فعالیت" description="ردِ تغییرات فضای کار؛ تا ۵۰۰ فعالیت اخیر." />
      <Stack direction="row" gap={2} mb={3}>
        <TextField
          label="جست‌وجوی فعالیت"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1, maxWidth: 400 }}
        />
        <TextField
          select
          label="نوع فعالیت"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {[
            ['all', 'همه'],
            ['project', 'پروژه'],
            ['task', 'تسک'],
            ['member', 'عضو'],
            ['system', 'سیستم'],
          ].map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Card sx={{ p: 3 }}>
        {filtered.length ? (
          <Stack>
            {filtered.slice(0, limit).map((a) => (
              <Stack
                key={a.id}
                direction="row"
                gap={2}
                py={2}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    mt: 1,
                    bgcolor:
                      a.kind === 'task'
                        ? '#4b77bb'
                        : a.kind === 'project'
                          ? '#218a6a'
                          : a.kind === 'member'
                            ? '#9067b4'
                            : '#be8d3b',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" flex={1}>
                  {a.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {formatDateTime(a.createdAt)}
                </Typography>
              </Stack>
            ))}
            {filtered.length > limit && (
              <Button onClick={() => setLimit(limit + 50)}>نمایش بیشتر</Button>
            )}
          </Stack>
        ) : (
          <EmptyState
            title="فعالیتی برای نمایش نیست"
            description="تغییرات واقعی شما در پروژه، اعضا و تسک‌ها اینجا ثبت می‌شوند."
          />
        )}
      </Card>
    </>
  );
}
