import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FolderOpenRounded from '@mui/icons-material/FolderOpenRounded';
export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Box sx={{ textAlign: 'center', py: 7, px: 2 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          mx: 'auto',
          mb: 2,
          bgcolor: 'action.hover',
          borderRadius: 4,
          display: 'grid',
          placeItems: 'center',
          color: 'primary.main',
        }}
      >
        <FolderOpenRounded sx={{ fontSize: 30 }} />
      </Box>
      <Typography variant="h6" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 420, mx: 'auto', mb: 2.5 }}
      >
        {description}
      </Typography>
      {action}
    </Box>
  );
}
