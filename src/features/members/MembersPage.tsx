import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddRounded from '@mui/icons-material/AddRounded';
import type { Member } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { liveMembers, liveTasks, normalizeSearch } from '../../shared/lib/selectors';
import { faNumber } from '../../shared/lib/dates';
import PageHeader from '../../shared/ui/PageHeader';
import EmptyState from '../../shared/ui/EmptyState';
import EntityMenu from '../../shared/ui/EntityMenu';
import { useFeedback } from '../../shared/ui/useFeedback';
import MemberForm from './MemberForm';
export default function MembersPage() {
  const data = useWorkspace((s) => s.data);
  const remove = useWorkspace((s) => s.remove);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const setQuery = (q: string) => setParams(q ? { q } : {}, { replace: true });
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState<Member | true | null>(null);
  const { confirm } = useFeedback();
  const tasks = liveTasks(data);
  const members = liveMembers(data).filter(
    (m) =>
      normalizeSearch(m.name + ' ' + m.role + ' ' + m.email).includes(normalizeSearch(query)) &&
      (filter === 'all' || m.active === (filter === 'active')),
  );
  return (
    <>
      <PageHeader
        title="اعضای تیم"
        description="آدم‌های پشت هر پیشرفت؛ مسئولیت‌ها را روشن نگه دارید."
        action={
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => setForm(true)}>
            عضو جدید
          </Button>
        }
      />
      <Stack direction="row" gap={2} mb={3}>
        <TextField
          label="جست‌وجوی عضو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1, maxWidth: 360 }}
        />
        <TextField
          select
          label="وضعیت"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">همهٔ اعضا</MenuItem>
          <MenuItem value="active">فعال</MenuItem>
          <MenuItem value="inactive">غیرفعال</MenuItem>
        </TextField>
      </Stack>
      {!members.length ? (
        <Card>
          <EmptyState
            title={
              data.members.some((m) => !m.deletedAt)
                ? 'عضوی با این مشخصات پیدا نشد'
                : 'تیمتان را اینجا بسازید'
            }
            description="اعضای تیم را ثبت کنید تا سرپرست پروژه و مسئول هر تسک مشخص باشد."
            action={
              <Button onClick={() => setForm(true)} variant="outlined">
                افزودن عضو
              </Button>
            }
          />
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', xl: 'repeat(3,1fr)' },
            gap: 2.5,
          }}
        >
          {members.map((m) => {
            const assigned = tasks.filter((t) => t.assigneeId === m.id);
            return (
              <Card key={m.id}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Avatar sx={{ bgcolor: m.color, width: 49, height: 49, borderRadius: 3 }}>
                      {m.name.slice(0, 1)}
                    </Avatar>
                    <EntityMenu
                      label={m.name}
                      onEdit={() => setForm(m)}
                      onDelete={() =>
                        confirm({
                          title: 'حذف عضو؟',
                          message: 'عضو به سطل زباله منتقل می‌شود و مسئولیت‌های او آزاد می‌شوند.',
                          danger: true,
                          onConfirm: () => remove('member', m.id),
                        })
                      }
                    />
                  </Stack>
                  <Typography variant="h6" fontWeight={700} mt={2}>
                    {m.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {m.role || 'سمت ثبت نشده'}
                  </Typography>
                  {m.email && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                      dir="ltr"
                      textAlign="start"
                    >
                      {m.email}
                    </Typography>
                  )}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
                    <Chip
                      label={m.active ? 'فعال' : 'غیرفعال'}
                      size="small"
                      color={m.active ? 'success' : 'default'}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {faNumber(assigned.filter((t) => t.status !== 'done').length)} کار باز ·{' '}
                      {faNumber(assigned.filter((t) => t.status === 'done').length)} تکمیل
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
      {form && (
        <MemberForm member={form === true ? undefined : form} onClose={() => setForm(null)} />
      )}
    </>
  );
}
