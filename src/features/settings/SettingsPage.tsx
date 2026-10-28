import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import type { Settings } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
import PageHeader from '../../shared/ui/PageHeader';
import BackupPanel from './BackupPanel';
import TrashPanel from './TrashPanel';
export default function SettingsPage() {
  const current = useWorkspace((s) => s.data.settings);
  const save = useWorkspace((s) => s.settings);
  const reset = useWorkspace((s) => s.reset);
  const [settings, setSettings] = useState<Settings>(current);
  const { run, confirm } = useFeedback();
  return (
    <>
      <PageHeader
        title="تنظیمات فضای کار"
        description="ظاهر، اطلاعات و نسخه‌های پشتیبان را مدیریت کنید."
      />
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography fontWeight={700} mb={3}>
            تنظیمات عمومی
          </Typography>
          <Stack spacing={2.5} maxWidth={500}>
            <TextField
              label="نام فضای کار"
              value={settings.workspaceName}
              onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
              inputProps={{ maxLength: 80 }}
              error={!settings.workspaceName.trim()}
            />
            <TextField
              select
              label="ظاهر برنامه"
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value as Settings['theme'] })
              }
            >
              <MenuItem value="light">روشن</MenuItem>
              <MenuItem value="dark">تیره</MenuItem>
              <MenuItem value="system">مطابق دستگاه</MenuItem>
            </TextField>
            <FormControlLabel
              label="نمایش فشردهٔ جدول‌ها و کنترل‌ها"
              control={
                <Switch
                  checked={settings.compact}
                  onChange={(_, compact) => setSettings({ ...settings, compact })}
                />
              }
            />
            <Button
              variant="contained"
              sx={{ alignSelf: 'start' }}
              disabled={!settings.workspaceName.trim()}
              onClick={() =>
                run(
                  () => save({ ...settings, workspaceName: settings.workspaceName.trim() }),
                  'تنظیمات ذخیره شد.',
                )
              }
            >
              ذخیرهٔ تنظیمات
            </Button>
          </Stack>
        </Card>
        <BackupPanel />
        <TrashPanel />
        <Card sx={{ p: 3, borderColor: 'error.main' }}>
          <Typography fontWeight={700} color="error.main" mb={1}>
            بازنشانی کامل
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            همهٔ پروژه‌ها، تسک‌ها، اعضا و تنظیمات حذف می‌شوند. پیش از ادامه پشتیبان بگیرید.
          </Alert>
          <Button
            color="error"
            variant="outlined"
            onClick={() =>
              confirm({
                title: 'بازنشانی کامل فضای کار؟',
                message:
                  'تمام اطلاعات این مرورگر پاک می‌شود. این کار با سطل زباله قابل بازگردانی نیست.',
                danger: true,
                action: 'پاک‌کردن تمام اطلاعات',
                onConfirm: () => {
                  reset();
                  setSettings({ workspaceName: 'فضای کار من', theme: 'light', compact: false });
                },
              })
            }
          >
            بازنشانی فضای کار
          </Button>
        </Card>
      </Stack>
    </>
  );
}
