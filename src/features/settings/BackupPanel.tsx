import { useRef } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import { useWorkspace } from '../../shared/lib/store';
import { STORAGE_KEY, downloadFile, validateWorkspace } from '../../shared/lib/storage';
import { today, faNumber } from '../../shared/lib/dates';
import { useFeedback } from '../../shared/ui/useFeedback';
export default function BackupPanel() {
  const data = useWorkspace((s) => s.data);
  const replace = useWorkspace((s) => s.replace);
  const locked = useWorkspace((s) => s.locked);
  const { notify, confirm } = useFeedback();
  const input = useRef<HTMLInputElement>(null);
  const bytes = new Blob([JSON.stringify(data)]).size;
  async function importFile(file?: File) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      notify('اندازهٔ فایل بیش از ۱۵ مگابایت است.', 'error');
      return;
    }
    try {
      const next = validateWorkspace(JSON.parse(await file.text()));
      confirm({
        title: 'بازیابی پشتیبان؟',
        message: `اطلاعات فعلی با ${faNumber(next.projects.length)} پروژه، ${faNumber(next.tasks.length)} تسک و ${faNumber(next.members.length)} عضو جایگزین می‌شود. ابتدا پشتیبان فعلی را دریافت کنید.`,
        action: 'جایگزینی اطلاعات',
        onConfirm: () => {
          replace(next);
          notify('پشتیبان بازیابی شد.');
        },
      });
    } catch (error) {
      notify(
        error instanceof Error && error.name !== 'ZodError'
          ? error.message
          : 'فایل پشتیبان معتبر نیست یا با نسخهٔ برنامه سازگار نیست.',
        'error',
      );
    }
  }
  return (
    <Card sx={{ p: 3 }}>
      <Typography fontWeight={700} mb={1}>
        پشتیبان‌گیری و انتقال اطلاعات
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        اطلاعات روی همین مرورگر و همین آدرس نگهداری می‌شوند. برای انتقال به دستگاه دیگر یا نگهداری
        نسخهٔ امن، فایل JSON دریافت کنید.
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        ذخیرهٔ فعلی: حدود {faNumber(bytes / 1024)} کیلوبایت. فایل‌های حجیم و پیوست باینری در این
        نسخه ذخیره نمی‌شوند.
      </Alert>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlined />}
          onClick={() =>
            downloadFile(`hamkar-backup-${today()}.json`, JSON.stringify(data, null, 2))
          }
        >
          دریافت پشتیبان JSON
        </Button>
        <Button
          variant="contained"
          startIcon={<UploadFileOutlined />}
          onClick={() => input.current?.click()}
        >
          بازیابی پشتیبان
        </Button>
        {locked && (
          <Button
            color="warning"
            onClick={() =>
              downloadFile(
                `hamkar-original-${today()}.txt`,
                localStorage.getItem(STORAGE_KEY) ?? '',
              )
            }
          >
            دریافت نسخهٔ اصلی آسیب‌دیده
          </Button>
        )}
      </Stack>
      <input
        ref={input}
        type="file"
        accept=".json,application/json"
        hidden
        aria-label="فایل پشتیبان"
        onChange={(e) => {
          void importFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </Card>
  );
}
