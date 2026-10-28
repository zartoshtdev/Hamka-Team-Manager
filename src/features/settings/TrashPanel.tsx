import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import type { EntityType } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import { formatDateTime } from '../../shared/lib/dates';
export default function TrashPanel() {
  const data = useWorkspace((s) => s.data);
  const restore = useWorkspace((s) => s.restore);
  const remove = useWorkspace((s) => s.remove);
  const { run, confirm } = useFeedback();
  const deleted = [
    ...data.projects
      .filter((e) => e.deletedAt)
      .map((e) => ({
        id: e.id,
        name: e.name,
        date: e.deletedAt!,
        kind: 'project' as EntityType,
        label: 'پروژه',
      })),
    ...data.tasks
      .filter((e) => e.deletedAt)
      .map((e) => ({
        id: e.id,
        name: e.title,
        date: e.deletedAt!,
        kind: 'task' as EntityType,
        label: 'تسک',
      })),
    ...data.members
      .filter((e) => e.deletedAt)
      .map((e) => ({
        id: e.id,
        name: e.name,
        date: e.deletedAt!,
        kind: 'member' as EntityType,
        label: 'عضو',
      })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <Card sx={{ p: 3 }}>
      <Typography fontWeight={700} mb={1}>
        سطل زباله
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        حذف دائمی پروژه، تسک‌های آن را هم حذف می‌کند. بازیابی عضو، مسئولیت‌های قبلی او را
        برنمی‌گرداند.
      </Typography>
      {deleted.map((e) => (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={1}
          key={e.kind + e.id}
          alignItems={{ sm: 'center' }}
          sx={{ py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Chip label={e.label} size="small" />
          <Stack flex={1}>
            <Typography variant="body2">{e.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(e.date)}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Button onClick={() => run(() => restore(e.kind, e.id), 'بازیابی شد.')}>بازیابی</Button>
            <Button
              color="error"
              onClick={() =>
                confirm({
                  title: 'حذف دائمی؟',
                  message: `«${e.name}» به‌صورت دائمی حذف می‌شود و قابل بازیابی نیست.`,
                  danger: true,
                  action: 'حذف دائمی',
                  onConfirm: () => remove(e.kind, e.id, true),
                })
              }
            >
              حذف دائمی
            </Button>
          </Stack>
        </Stack>
      ))}
      {!deleted.length && (
        <Typography color="text.secondary" variant="body2" py={2}>
          سطل زباله خالی است.
        </Typography>
      )}
    </Card>
  );
}
