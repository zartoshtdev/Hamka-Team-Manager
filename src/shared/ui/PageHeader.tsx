import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
      gap={2}
      mb={3.5}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight={800} mb={0.7}>
          {title}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
