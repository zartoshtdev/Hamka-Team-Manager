import type { ReactNode } from 'react';
import { useMemo, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useWorkspace } from '../shared/lib/store';
import { FeedbackProvider } from '../shared/ui/Feedback';
import { makeTheme } from './theme';
import { STORAGE_KEY, loadWorkspace } from '../shared/lib/storage';
const cache = createCache({ key: 'hamkar-rtl', stylisPlugins: [prefixer, rtlPlugin] });
export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.storageArea === localStorage && (event.key === STORAGE_KEY || event.key === null)) {
        const { data, error } = loadWorkspace();
        useWorkspace.setState({ data, error, locked: !!error });
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const settings = useWorkspace((s) => s.data.settings);
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const dark = settings.theme === 'system' ? systemDark : settings.theme === 'dark';
  const theme = useMemo(() => makeTheme(dark, settings.compact), [dark, settings.compact]);
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FeedbackProvider>{children}</FeedbackProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
