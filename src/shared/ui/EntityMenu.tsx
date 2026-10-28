import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
interface Props {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  archived?: boolean;
}
export default function EntityMenu({
  label,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  archived,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const act = (fn: () => void) => {
    setAnchor(null);
    fn();
  };
  return (
    <>
      <IconButton
        size="small"
        aria-label={`عملیات ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          setAnchor(e.currentTarget);
        }}
      >
        <MoreHorizRounded />
      </IconButton>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => act(onEdit)}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          ویرایش
        </MenuItem>
        {onDuplicate && (
          <MenuItem onClick={() => act(onDuplicate)}>
            <ListItemIcon>
              <ContentCopyRounded fontSize="small" />
            </ListItemIcon>
            ساخت نسخهٔ مشابه
          </MenuItem>
        )}
        {onArchive && (
          <MenuItem onClick={() => act(onArchive)}>
            <ListItemIcon>
              <ArchiveOutlined fontSize="small" />
            </ListItemIcon>
            {archived ? 'خروج از بایگانی' : 'بایگانی'}
          </MenuItem>
        )}
        <MenuItem onClick={() => act(onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlineRounded color="error" fontSize="small" />
          </ListItemIcon>
          انتقال به سطل زباله
        </MenuItem>
      </Menu>
    </>
  );
}
