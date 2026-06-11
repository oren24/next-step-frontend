import { useState } from 'react';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Alert
} from '@mui/material';

export default function AddResumeModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let filePath = null;
      if (file) {
        if (!storage) throw new Error('Firebase Storage is not configured.');
        const fileRef = ref(storage, `resumes/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
        await uploadBytes(fileRef, file);
        filePath = await getDownloadURL(fileRef);
      }
      
      const payload = {
        title,
        target_role: targetRole || undefined,
        note: note || undefined,
        file_path: filePath || undefined,
        original_filename: file ? file.name : undefined
      };

      await onSubmit(payload);
      
      setTitle('');
      setTargetRole('');
      setNote('');
      setFile(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add resume');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setTargetRole('');
    setNote('');
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Resume</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              autoFocus
              label="Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Resume"
            />
            
            <TextField
              label="Target Role"
              fullWidth
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. React / UI Engineer"
            />

            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {file ? file.name : "Upload PDF Resume"}
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            
            <TextField
              label="Note"
              fullWidth
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Tailored for product companies"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Resume'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
