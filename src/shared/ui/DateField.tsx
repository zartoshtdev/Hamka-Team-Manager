import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { faIR } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { localDate, parseDate } from '../lib/dates';
export default function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFnsJalali}
      localeText={faIR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <DatePicker
        label={label}
        value={parseDate(value)}
        onChange={(date) => onChange(date && !Number.isNaN(+date) ? localDate(date) : '')}
        slotProps={{
          textField: { fullWidth: true, size: 'small', error: !!error, helperText: error },
          field: { clearable: true },
          actionBar: { actions: ['clear', 'today', 'accept'] },
        }}
      />
    </LocalizationProvider>
  );
}
