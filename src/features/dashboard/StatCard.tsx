import type { ElementType } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
  color: string;
}) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 37,
            height: 37,
            borderRadius: 2,
            bgcolor: alpha(color, 0.1),
            color,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>
      </Stack>
      <Typography variant="h4" fontWeight={800} my={1}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {detail}
      </Typography>
    </Card>
  );
}
