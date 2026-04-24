import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';

const sectionTitleStyle = {
  fontSize: '1rem',
  fontWeight: 700,
};

const itemCardStyle = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
};

function ArchiveItemCard({ app, reason, onPrimaryAction, primaryLabel, onSecondaryAction, secondaryLabel }) {
  return (
    <Paper variant="outlined" sx={itemCardStyle}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700 }}>{app.companyName || app.company || '--'}</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{app.jobTitle || app.position || '--'}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label={`Status: ${app.status || '--'}`} />
            <Chip size="small" variant="outlined" label={reason} />
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          {onPrimaryAction && (
            <Button size="small" variant="contained" onClick={() => onPrimaryAction(app.id)}>
              {primaryLabel}
            </Button>
          )}
          {onSecondaryAction && (
            <Button size="small" color="error" variant="outlined" onClick={() => onSecondaryAction(app.id)}>
              {secondaryLabel}
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function Archive({
  apps = [],
  deletedApps = [],
  onRestoreDeleted,
  onRemoveDeleted,
  onRestoreRejected,
}) {
  const rejectedApps = apps.filter((app) => app.status === 'Rejected');
  const isEmpty = rejectedApps.length === 0 && deletedApps.length === 0;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Archive</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
        Jobs with rejected status and deleted jobs are stored here.
      </Typography>

      {isEmpty && (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          Archive is empty.
        </Paper>
      )}

      {rejectedApps.length > 0 && (
        <Stack spacing={1.25}>
          <Typography sx={sectionTitleStyle}>Rejected Applications ({rejectedApps.length})</Typography>
          {rejectedApps.map((app) => (
            <ArchiveItemCard
              key={app.id}
              app={app}
              reason="Rejected"
              onPrimaryAction={onRestoreRejected}
              primaryLabel="Move to Applied"
            />
          ))}
        </Stack>
      )}

      {rejectedApps.length > 0 && deletedApps.length > 0 && <Divider />}

      {deletedApps.length > 0 && (
        <Stack spacing={1.25}>
          <Typography sx={sectionTitleStyle}>Deleted Applications ({deletedApps.length})</Typography>
          {deletedApps.map((app) => (
            <ArchiveItemCard
              key={app.id}
              app={app}
              reason="Deleted"
              onPrimaryAction={onRestoreDeleted}
              primaryLabel="Restore"
              onSecondaryAction={onRemoveDeleted}
              secondaryLabel="Remove"
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
