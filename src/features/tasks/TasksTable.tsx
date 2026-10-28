import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import type { Task, Workspace } from '../../shared/types/models';
import { STATUSES, PRIORITIES, PRIORITY_COLORS } from '../../shared/lib/constants';
import { formatDate, isOverdue, faNumber } from '../../shared/lib/dates';
import EntityMenu from '../../shared/ui/EntityMenu';
import { useTaskActions } from './useTaskActions';
export default function TasksTable({
  tasks,
  data,
  selected,
  onSelect,
  onEdit,
}: {
  tasks: Task[];
  data: Workspace;
  selected: string[];
  onSelect: (ids: string[]) => void;
  onEdit: (task: Task) => void;
}) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [, setParams] = useSearchParams();
  const actions = useTaskActions();
  const actualPage = Math.min(page, Math.max(0, Math.ceil(tasks.length / rows) - 1));
  const all = tasks.length > 0 && tasks.every((t) => selected.includes(t.id));
  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 820 }} aria-label="جدول تسک‌ها">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={all}
                  indeterminate={!all && tasks.some((t) => selected.includes(t.id))}
                  inputProps={{ 'aria-label': 'انتخاب همهٔ تسک‌ها' }}
                  onChange={(_, checked) => onSelect(checked ? tasks.map((t) => t.id) : [])}
                />
              </TableCell>
              {['عنوان تسک', 'پروژه', 'مسئول', 'وضعیت', 'اولویت', 'موعد', ''].map((s, i) => (
                <TableCell key={i}>{s}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.slice(actualPage * rows, actualPage * rows + rows).map((t) => {
              const member = data.members.find((m) => m.id === t.assigneeId);
              return (
                <TableRow key={t.id} hover selected={selected.includes(t.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(t.id)}
                      inputProps={{ 'aria-label': `انتخاب ${t.title}` }}
                      onChange={(_, checked) =>
                        onSelect(
                          checked ? [...selected, t.id] : selected.filter((id) => id !== t.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200, maxWidth: 320 }}>
                    <Button
                      onClick={() => setParams({ task: t.id })}
                      sx={{
                        p: 0,
                        minHeight: 0,
                        textAlign: 'start',
                        justifyContent: 'start',
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {t.title}
                    </Button>
                    {t.checklist.length > 0 && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {faNumber(t.checklist.filter((c) => c.done).length)} /{' '}
                        {faNumber(t.checklist.length)} زیرکار
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {data.projects.find((p) => p.id === t.projectId)?.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.8} alignItems="center">
                      {member && (
                        <Avatar sx={{ width: 24, height: 24, bgcolor: member.color, fontSize: 11 }}>
                          {member.name[0]}
                        </Avatar>
                      )}
                      <Typography variant="caption">{member?.name || 'بدون مسئول'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={STATUSES[t.status]}
                      color={
                        t.status === 'done'
                          ? 'success'
                          : t.status === 'progress'
                            ? 'info'
                            : 'default'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={PRIORITIES[t.priority]}
                      color={PRIORITY_COLORS[t.priority]}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      color: isOverdue(t) ? 'error.main' : 'text.secondary',
                    }}
                  >
                    {formatDate(t.dueDate)}
                  </TableCell>
                  <TableCell>
                    <EntityMenu
                      label={t.title}
                      onEdit={() => onEdit(t)}
                      onDuplicate={() => actions.duplicate(t)}
                      onArchive={() => actions.archive(t)}
                      archived={t.archived}
                      onDelete={() => actions.remove(t)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={tasks.length}
        page={actualPage}
        rowsPerPage={rows}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, page) => setPage(page)}
        onRowsPerPageChange={(e) => {
          setRows(+e.target.value);
          setPage(0);
        }}
        labelRowsPerPage="تعداد در صفحه"
        labelDisplayedRows={({ from, to, count }) =>
          `${faNumber(from)}–${faNumber(to)} از ${faNumber(count)}`
        }
        getItemAriaLabel={(type) => (type === 'next' ? 'صفحه بعد' : 'صفحه قبل')}
      />
    </>
  );
}
