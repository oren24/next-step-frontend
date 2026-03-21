import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

const subscriptions = [
  {
    name: 'LinkedIn Premium',
    renewal: '2026-04-01',
    status: 'Active',
  },
  {
    name: 'Interview Prep Platform',
    renewal: '2026-03-28',
    status: 'Trial',
  },
];

export default function Subscriptions() {
  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Subscriptions</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
        Keep track of tools used across your job search workflow.
      </Typography>

      <Stack spacing={1.5}>
        {subscriptions.map((item) => (
          <Paper key={item.name} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  Renewal: {new Date(item.renewal).toLocaleDateString()}
                </Typography>
              </Box>
              <Chip label={item.status} size="small" color={item.status === 'Active' ? 'success' : 'default'} />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
