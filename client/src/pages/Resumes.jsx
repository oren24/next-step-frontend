import { Box, Button, Paper, Stack, Typography } from '@mui/material';

const resumeCards = [
  {
    title: 'Frontend Resume',
    targetRole: 'React / UI Engineer',
    note: 'Tailored for product companies and modern frontend stacks.',
  },
  {
    title: 'Fullstack Resume',
    targetRole: 'Node.js / React Fullstack',
    note: 'Balanced profile for end-to-end ownership roles.',
  },
];

export default function Resumes() {
  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Resumes</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            Track resume versions for different job targets.
          </Typography>
        </Box>
        <Button variant="contained">Add Resume</Button>
      </Stack>

      <Stack spacing={1.5}>
        {resumeCards.map((resume) => (
          <Paper key={resume.title} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>{resume.title}</Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.25 }}>{resume.targetRole}</Typography>
            <Typography sx={{ fontSize: '0.86rem', mt: 1 }}>{resume.note}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
