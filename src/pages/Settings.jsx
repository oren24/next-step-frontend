import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

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

const validatePasswordInput = (password, confirmPassword) => {
  if (password !== confirmPassword) return 'New passwords do not match.';
  if (password.length < 8) return 'New password must be at least 8 characters.';
  return null;
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, deleteAccount, signOut } = useAuth();

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState({ type: 'success', text: '' });

  const hasMessage = Boolean(message.text);
  const canUpdateProfile = Boolean(profileName.trim() && profileEmail.trim());

  const passwordMismatch = useMemo(() => (
    newPassword && confirmNewPassword && newPassword !== confirmNewPassword
  ), [newPassword, confirmNewPassword]);

  const handleProfileSave = async () => {
    setMessage({ type: 'success', text: '' });
    try {
      await updateProfile({ name: profileName, email: profileEmail });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not update profile.' });
    }
  };

  const handlePasswordUpdate = async () => {
    setMessage({ type: 'success', text: '' });
    const validationError = validatePasswordInput(newPassword, confirmNewPassword);
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    try {
      await changePassword({ currentPassword, nextPassword: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMessage({ type: 'success', text: 'Password updated.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not update password.' });
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/auth/sign-in');
  };

  const handleDeleteAccount = async () => {
    setMessage({ type: 'success', text: '' });

    try {
      await deleteAccount({ password: deletePassword });
      setIsDeleteDialogOpen(false);
      setDeletePassword('');
      navigate('/auth/sign-up', { replace: true });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not delete account.' });
    }
  };

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Settings</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
        Personalize your job-tracking workspace experience.
      </Typography>

      {hasMessage && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Account</Typography>
        <Stack spacing={1.5}>
          <TextField
            label="Full name"
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={profileEmail}
            onChange={(event) => setProfileEmail(event.target.value)}
            fullWidth
          />
          <Box>
            <Button
              variant="contained"
              onClick={handleProfileSave}
              disabled={!canUpdateProfile}
            >
              Save Profile
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Security</Typography>
        <Stack spacing={1.5}>
          <TextField
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            fullWidth
          />
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            helperText="At least 8 characters"
            fullWidth
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
            error={passwordMismatch}
            helperText={passwordMismatch ? 'Passwords must match.' : ' '}
            fullWidth
          />
          <Box>
            <Button
              variant="contained"
              onClick={handlePasswordUpdate}
              disabled={!currentPassword || !newPassword || !confirmNewPassword}
            >
              Change Password
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Workspace Preferences</Typography>
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

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Session</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <Button variant="outlined" onClick={handleSignOut}>
            Sign Out
          </Button>
          <Button color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)}>
            Delete Account
          </Button>
        </Stack>
      </Paper>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete account?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.25, color: 'text.secondary' }}>
            This removes your local account from this browser and signs you out.
          </Typography>
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
            autoFocus
          />
          <Divider sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={!deletePassword}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
