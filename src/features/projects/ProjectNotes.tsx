import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { Project } from '../../shared/types/models';
import { useWorkspace } from '../../shared/lib/store';
import { useFeedback } from '../../shared/ui/useFeedback';
export default function ProjectNotes({ project }: { project: Project }) {
  const [notes, setNotes] = useState(project.notes);
  const save = useWorkspace((s) => s.save);
  const { run } = useFeedback();
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={700}>یادداشت‌های پروژه</Typography>
          <Button
            size="small"
            disabled={notes === project.notes}
            onClick={() => run(() => save('project', { ...project, notes }), 'یادداشت ذخیره شد.')}
          >
            ذخیرهٔ یادداشت
          </Button>
        </Stack>
        <TextField
          multiline
          minRows={9}
          fullWidth
          placeholder="تصمیم‌ها، هدف‌ها و نکته‌های پروژه را اینجا بنویسید…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          inputProps={{ 'aria-label': 'یادداشت پروژه', maxLength: 20000 }}
        />
      </CardContent>
    </Card>
  );
}
