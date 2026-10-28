import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { useWorkspace } from '../shared/lib/store';
import { liveMembers, liveProjects, liveTasks, normalizeSearch } from '../shared/lib/selectors';
export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const data = useWorkspace((s) => s.data);
  const navigate = useNavigate();
  const q = normalizeSearch(query);
  const results = q
    ? [
        ...liveProjects(data).map((p) => ({
          id: p.id,
          title: p.name,
          kind: 'پروژه',
          url: `/projects/${p.id}`,
        })),
        ...liveTasks(data).map((t) => ({
          id: t.id,
          title: t.title,
          kind: 'تسک',
          url: `/tasks?task=${t.id}`,
        })),
        ...liveMembers(data).map((m) => ({
          id: m.id,
          title: m.name,
          kind: 'عضو',
          url: `/members?q=${encodeURIComponent(m.name)}`,
        })),
      ]
        .filter((r) => normalizeSearch(r.title).includes(q))
        .slice(0, 20)
    : [];
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box p={2}>
        <TextField
          autoFocus
          fullWidth
          placeholder="جست‌وجوی پروژه، تسک یا عضو…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            },
          }}
          inputProps={{ 'aria-label': 'جست‌وجوی سراسری' }}
        />
      </Box>
      <List sx={{ maxHeight: 400, overflow: 'auto', pb: 2 }}>
        {results.map((r) => (
          <ListItemButton
            key={r.kind + r.id}
            onClick={() => {
              navigate(r.url);
              onClose();
              setQuery('');
            }}
          >
            <ListItemText primary={r.title} secondary={r.kind} />
          </ListItemButton>
        ))}
        {!results.length && (
          <Typography textAlign="center" color="text.secondary" py={4}>
            {q ? 'نتیجه‌ای پیدا نشد.' : 'نام مورد موردنظر را بنویسید.'}
          </Typography>
        )}
      </List>
    </Dialog>
  );
}
