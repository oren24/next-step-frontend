import { Box, FormControlLabel, Paper, Stack, Switch, Typography } from '@mui/material';

const settingRows = [
  {
    title: 'Show Draft Applications',
    description: 'Include draft cards in list and kanban views.',
    defaultChecked: true,
  },
  {
    title: 'Enable Share Fallback Copy',
    description: 'Copy job link automatically when native share is unavailable.',
    defaultChecked: true,
  },
  {
    title: 'Compact List View',
    description: 'Use tighter row spacing in Applications List.',
    defaultChecked: false,
  },
];

export default function Settings() {
  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Settings</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
        Personalize your job-tracking workspace experience.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={1.5}>
          {settingRows.map((row) => (
            <FormControlLabel
              key={row.title}
              control={<Switch defaultChecked={row.defaultChecked} />}
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{row.title}</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                    {row.description}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', m: 0 }}
            />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
