import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import AddRounded from '@mui/icons-material/AddRounded';
import type { Project } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { normalizeSearch } from '../../shared/lib/selectors';
import { PROJECT_STATUSES } from '../../shared/lib/constants';
import { faNumber } from '../../shared/lib/dates';
import PageHeader from '../../shared/ui/PageHeader';
import EmptyState from '../../shared/ui/EmptyState';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';
export default function ProjectsPage() {
  const data = useWorkspace((s) => s.data);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [params] = useSearchParams();
  const [form, setForm] = useState<Project | true | null>(params.get('new') === '1' ? true : null);
  const [sort, setSort] = useState('newest');
  const projects = data.projects
    .filter(
      (p) =>
        !p.deletedAt &&
        normalizeSearch(p.name + ' ' + p.description).includes(normalizeSearch(query)) &&
        (filter === 'archived'
          ? p.archived
          : !p.archived && (filter === 'all' || p.status === filter)),
    )
    .sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name, 'fa')
        : sort === 'due'
          ? (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
          : b.createdAt.localeCompare(a.createdAt),
    );
  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        description="از اولین ایده تا آخرین تسک؛ همه‌چیز در یک نگاه."
        action={
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => setForm(true)}>
            پروژهٔ جدید
          </Button>
        }
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={2} mb={3}>
        <TextField
          label="جست‌وجوی پروژه"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 180, flex: 1, maxWidth: { sm: 350 } }}
        />
        <TextField
          select
          label="وضعیت"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 155 }}
        >
          <MenuItem value="all">همهٔ پروژه‌ها</MenuItem>
          {Object.entries(PROJECT_STATUSES).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
          <MenuItem value="archived">بایگانی</MenuItem>
        </TextField>
        <TextField
          select
          label="مرتب‌سازی"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="newest">جدیدترین</MenuItem>
          <MenuItem value="name">نام پروژه</MenuItem>
          <MenuItem value="due">نزدیک‌ترین موعد</MenuItem>
        </TextField>
        <Chip sx={{ ml: { sm: 'auto' } }} label={`${faNumber(projects.length)} پروژه`} />
      </Stack>
      {projects.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)', xl: 'repeat(3,1fr)' },
            gap: 2.5,
          }}
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={() => setForm(p)} />
          ))}
        </Box>
      ) : (
        <Card>
          <EmptyState
            title={
              data.projects.some((p) => !p.deletedAt)
                ? 'پروژه‌ای با این فیلتر پیدا نشد'
                : 'اولین پروژه‌ات را شروع کن'
            }
            description="نام پروژه، سرپرست و اعضای آن را مشخص کن؛ بعد کارها را قدم‌به‌قدم پیش ببر."
            action={
              <Button variant="contained" onClick={() => setForm(true)}>
                ساخت پروژه
              </Button>
            }
          />
        </Card>
      )}
      {form && (
        <ProjectForm project={form === true ? undefined : form} onClose={() => setForm(null)} />
      )}
    </>
  );
}
