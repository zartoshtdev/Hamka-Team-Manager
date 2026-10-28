import { createTheme, alpha } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';
export function makeTheme(dark: boolean, compact: boolean) {
  return createTheme(
    {
      direction: 'rtl',
      palette: {
        mode: dark ? 'dark' : 'light',
        primary: { main: dark ? '#72c8ab' : '#176b58' },
        secondary: { main: '#c08d4f' },
        background: { default: dark ? '#111b1a' : '#f5f6f8', paper: dark ? '#1b2927' : '#fff' },
        text: { primary: dark ? '#e7eeeb' : '#1c302a', secondary: dark ? '#a1b6ad' : '#73817b' },
        divider: dark ? '#31413b' : '#e8edea',
      },
      typography: {
        fontFamily: 'Vazirmatn, sans-serif',
        h4: { fontSize: '1.75rem', lineHeight: 1.5 },
        h5: { fontSize: '1.35rem' },
        h6: { fontSize: '1.04rem' },
        button: { textTransform: 'none', fontWeight: 600 },
        body2: { lineHeight: 1.9 },
      },
      shape: { borderRadius: 12 },
      spacing: 8,
      components: {
        MuiButton: {
          defaultProps: { disableElevation: true, size: compact ? 'small' : 'medium' },
          styleOverrides: { root: { borderRadius: 9, minHeight: 38, paddingInline: 18 } },
        },
        MuiTextField: { defaultProps: { size: 'small' } },
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiCard: {
          defaultProps: { variant: 'outlined' },
          styleOverrides: { root: { borderRadius: 16 } },
        },
        MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
        MuiDialogContent: { styleOverrides: { root: { paddingTop: '12px !important' } } },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: compact ? '10px 16px' : '16px',
              borderBottomColor: dark ? '#31413b' : '#edf0ee',
            },
            head: {
              fontWeight: 700,
              color: dark ? '#a1b6ad' : '#73817b',
              backgroundColor: dark ? '#1e302b' : '#f8faf9',
            },
          },
        },
        MuiChip: { styleOverrides: { root: { borderRadius: 7, height: 25, fontSize: 12 } } },
        MuiMenu: {
          styleOverrides: {
            paper: { borderRadius: 12, minWidth: 180, boxShadow: '0 8px 35px #102c251a' },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: { margin: 0 },
            '*': { boxSizing: 'border-box' },
            '::selection': { background: alpha('#176b58', 0.2) },
            a: { color: 'inherit', textDecoration: 'none' },
            'button,input,textarea': { fontFamily: 'inherit' },
            '::-webkit-scrollbar': { width: 6, height: 6 },
            '::-webkit-scrollbar-thumb': { background: '#b5c2bb', borderRadius: 8 },
          },
        },
      },
    },
    faIR,
  );
}
