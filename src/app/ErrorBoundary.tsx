import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error', error, info);
  }
  render() {
    return this.state.failed ? (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h5" mb={2}>
          نمایش این بخش با خطا روبه‌رو شد.
        </Typography>
        <Typography color="text.secondary" mb={2}>
          اطلاعات ذخیره‌شدهٔ شما پاک نشده است.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          بارگذاری دوباره
        </Button>
      </Box>
    ) : (
      this.props.children
    );
  }
}
