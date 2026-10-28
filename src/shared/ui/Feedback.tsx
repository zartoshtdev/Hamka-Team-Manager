import { FeedbackContext, type ConfirmOptions } from './useFeedback';
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    text: string;
    severity: 'success' | 'error' | 'info';
  } | null>(null);
  const [prompt, setPrompt] = useState<ConfirmOptions | null>(null);
  const notify = useCallback(
    (text: string, severity: 'success' | 'error' | 'info' = 'success') =>
      setToast({ text, severity }),
    [],
  );
  const run = useCallback(
    (action: () => void, success?: string) => {
      try {
        action();
        if (success) notify(success);
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : 'عملیات انجام نشد.', 'error');
        return false;
      }
    },
    [notify],
  );
  return (
    <FeedbackContext value={{ notify, run, confirm: setPrompt }}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.severity} variant="filled" onClose={() => setToast(null)}>
          {toast?.text}
        </Alert>
      </Snackbar>
      <Dialog open={!!prompt} onClose={() => setPrompt(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{prompt?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{prompt?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrompt(null)}>انصراف</Button>
          <Button
            color={prompt?.danger ? 'error' : 'primary'}
            variant="contained"
            onClick={() => {
              if (prompt) {
                const ok = run(prompt.onConfirm);
                if (ok) setPrompt(null);
              }
            }}
          >
            {prompt?.action ?? 'تأیید'}
          </Button>
        </DialogActions>
      </Dialog>
    </FeedbackContext>
  );
}
