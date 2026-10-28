import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CheckRounded from '@mui/icons-material/CheckRounded';
import { COLORS } from '../lib/constants';
export default function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2" sx={{ mr: 1 }}>
        رنگ
      </Typography>
      {COLORS.map((color) => (
        <IconButton
          key={color}
          aria-label={`انتخاب رنگ ${color}`}
          aria-pressed={color === value}
          onClick={() => onChange(color)}
          sx={{
            width: 30,
            height: 30,
            bgcolor: color,
            color: 'white',
            border: color === value ? '2px solid' : '2px solid transparent',
            borderColor: color === value ? 'text.primary' : 'transparent',
            '&:hover': { bgcolor: color, opacity: 0.8 },
          }}
        >
          {value === color && <CheckRounded sx={{ fontSize: 18 }} />}
        </IconButton>
      ))}
    </Stack>
  );
}
