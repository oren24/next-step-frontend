import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

const cardStyle = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
};

export default function Drafts({ apps = [] }) {
  const navigate = useNavigate();
  const drafts = apps.filter((app) => app.isDraft);

  const handleContinueEditing = (draftId) => {
    navigate('/', {
      state: { openDraftId: draftId },
    });
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Drafts</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
        Review all saved draft applications before you submit them.
      </Typography>

      {drafts.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          No saved drafts yet.
        </Paper>
      ) : (
        <Stack spacing={1.25}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
            Saved Drafts ({drafts.length})
          </Typography>
          {drafts.map((app) => (
            <Paper key={app.id} variant="outlined" sx={cardStyle}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {app.companyName || '--'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                    {app.jobTitle || '--'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    <Chip size="small" label={`Status: ${app.status || '--'}`} />
                    <Chip size="small" variant="outlined" label={`Saved: ${app.draftSavedAt ? new Date(app.draftSavedAt).toLocaleString() : '--'}`} />
                  </Stack>
                </Box>
                <Chip size="small" color="primary" label="Draft" />
              </Stack>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
                <Button size="small" variant="contained" onClick={() => handleContinueEditing(app.id)}>
                  Continue Editing
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}

Drafts.propTypes = {
  apps: PropTypes.array,
};

