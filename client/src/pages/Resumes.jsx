import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, Alert, Dialog } from '@mui/material';
import { resumesApi, getServerUrl } from '../api/apiClient';
import AddResumeModal from '../components/popapmodals/AddResumeModal';
import { useAuth } from '../auth/useAuth';
import { storage } from '../config/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { useMediaQuery, useTheme } from '@mui/material';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      const newMockResume = {
        id: `mock-new-${Date.now()}`,
        title: data.title,
        target_role: data.target_role,
        note: data.note,
        original_filename: data.original_filename,
        file_path: data.file_path,
      };
      setResumes([newMockResume, ...resumes]);
      setError('Backend unavailable. Resume added to local UI only.');
    }
  };

  const handleDeleteResume = async (resume) => {
    if (!window.confirm(`Are you sure you want to delete "${resume.title}"?`)) return;

    try {
      // 1. Delete from Firebase Storage if applicable
      if (resume.file_path && resume.file_path.includes('firebasestorage.googleapis.com')) {
        try {
          // Firebase Storage URLs encode the path between '/o/' and '?alt=media'
          const decodedUrl = decodeURIComponent(resume.file_path);
          const pathStartIndex = decodedUrl.indexOf('/o/') + 3;
          const pathEndIndex = decodedUrl.indexOf('?alt=media');
          if (pathStartIndex > 2 && pathEndIndex > -1) {
            const storagePath = decodedUrl.substring(pathStartIndex, pathEndIndex);
            const fileRef = ref(storage, storagePath);
            await deleteObject(fileRef);
          }
        } catch (storageErr) {
          console.error('Failed to delete file from Firebase Storage:', storageErr);
        }
      }

      // 2. Delete from backend database
      if (!resume.id.toString().startsWith('mock-')) {
        await resumesApi.delete(resume.id);
      }

      // 3. Update UI state
      setResumes(resumes.filter(r => r.id !== resume.id));
    } catch (err) {
      console.error('Failed to delete resume:', err);
      setError('Failed to delete resume. Please try again.');
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
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{resume.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.25 }}>{resume.target_role || resume.targetRole}</Typography>
                    <Typography sx={{ fontSize: '0.86rem', mt: 1 }}>{resume.note}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {(resume.file_path || resume.original_filename) && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => {
                          if (!resume.file_path) {
                            alert("No file available for preview.");
                            return;
                          }
                          const url = resume.file_path.startsWith('http') || resume.file_path.startsWith('blob:') 
                            ? resume.file_path 
                            : `${getServerUrl()}/${resume.file_path.replace(/\\/g, '/').replace(/^\//, '')}`;
                          setPreviewUrl(url);
                        }}
                      >
                        {resume.original_filename || 'Preview PDF'}
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteResume(resume)}
                    >
                      Delete
                    </Button>
                  </Stack>
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
        fullScreen={isMobile}
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
