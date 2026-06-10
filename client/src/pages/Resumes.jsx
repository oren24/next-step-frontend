import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, Alert, Dialog } from '@mui/material';
import { resumesApi } from '../api/apiClient';
import AddResumeModal from '../components/popapmodals/AddResumeModal';
import { useAuth } from '../auth/useAuth';

// Fallback initial data in case the backend is down
const fallbackResumes = [
  {
    id: 'mock-1',
    title: 'Frontend Resume (Mock)',
    target_role: 'React / UI Engineer',
    note: 'Tailored for product companies and modern frontend stacks.',
  },
  {
    id: 'mock-2',
    title: 'Fullstack Resume (Mock)',
    target_role: 'Node.js / React Fullstack',
    note: 'Balanced profile for end-to-end ownership roles.',
  },
];

export default function Resumes() {
  const { toolpadSession } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await resumesApi.getAll();
        setResumes(response.data);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        if (toolpadSession?.user?.authProvider === 'github') {
          setError('Demo Mode: Showing local mock data.');
          setResumes(fallbackResumes);
        } else {
          setError('Failed to fetch resumes from the server.');
          setResumes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [toolpadSession]);

  const handleAddResume = async (data) => {
    try {
      const response = await resumesApi.create(data);
      setResumes([response.data, ...resumes]);
    } catch (err) {
      console.error('Failed to add resume via API:', err);
      // Fallback for UI if DB is offline
      const isFormData = data instanceof FormData;
      const file = isFormData ? data.get('file') : null;
      const newMockResume = {
        id: `mock-new-${Date.now()}`,
        title: isFormData ? data.get('title') : data.title,
        target_role: isFormData ? data.get('target_role') : data.target_role,
        note: isFormData ? data.get('note') : data.note,
        original_filename: file ? file.name : null,
        file_path: file ? URL.createObjectURL(file) : null,
      };
      setResumes([newMockResume, ...resumes]);
      setError('Backend unavailable. Resume added to local UI only.');
    }
  };

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Resumes</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            Track resume versions for different job targets.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setModalOpen(true)}>Add Resume</Button>
      </Stack>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {resumes.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', mt: 2 }}>No resumes added yet.</Typography>
          ) : (
            resumes.map((resume) => (
              <Paper key={resume.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{resume.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.25 }}>{resume.target_role || resume.targetRole}</Typography>
                    <Typography sx={{ fontSize: '0.86rem', mt: 1 }}>{resume.note}</Typography>
                  </Box>
                  {(resume.file_path || resume.original_filename) && (
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        if (!resume.file_path) {
                          alert("No file available for preview.");
                          return;
                        }
                        const url = resume.file_path.startsWith('blob:') 
                          ? resume.file_path 
                          : `http://localhost:5000/${resume.file_path}`;
                        setPreviewUrl(url);
                      }}
                    >
                      {resume.original_filename || 'Preview PDF'}
                    </Button>
                  )}
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      )}

      <AddResumeModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleAddResume} 
      />

      {/* PDF Preview Modal */}
      <Dialog 
        open={Boolean(previewUrl)} 
        onClose={() => setPreviewUrl(null)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="flex-end" p={1} bgcolor="grey.100">
            <Button onClick={() => setPreviewUrl(null)} variant="text">Close</Button>
          </Stack>
          {previewUrl ? (
            <iframe 
              src={previewUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 'none', flexGrow: 1 }}
              title="PDF Preview"
            />
          ) : (
            <Box p={4} display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
              <Typography color="text.secondary">No file available to preview.</Typography>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
