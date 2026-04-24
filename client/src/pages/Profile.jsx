import { useEffect, useMemo, useState } from 'react';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../auth/useAuth.js';
import { WORK_TYPES } from '../constants/workTypes.js';

const EMPTY_PROFILE = {
  personal: {
    phone: '',
    location: '',
    headline: '',
    bio: '',
  },
  professional: {
    currentCompany: '',
    yearsOfExperience: '',
    workType: '',
    skills: '',
    linkedinUrl: '',
    portfolioUrl: '',
  },
};

const mapProfileToForm = (profile) => ({
  personal: {
    ...EMPTY_PROFILE.personal,
    ...profile?.personal,
  },
  professional: {
    ...EMPTY_PROFILE.professional,
    ...profile?.professional,
    skills: Array.isArray(profile?.professional?.skills)
      ? profile.professional.skills.join(', ')
      : '',
  },
});

const parseSkills = (skillsString) => skillsString
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [formData, setFormData] = useState(() => mapProfileToForm(user?.profile));
  const [message, setMessage] = useState({ type: 'success', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  const initialForm = useMemo(() => mapProfileToForm(user?.profile), [user?.profile]);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setFormData(initialForm);
  }, [initialForm, user?.name, user?.email]);

  const handleFieldChange = (section, field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setMessage({ type: 'success', text: '' });
    setIsSaving(true);

    try {
      await updateProfile({
        name,
        email,
        profile: {
          personal: formData.personal,
          professional: {
            ...formData.professional,
            skills: parseSkills(formData.professional.skills),
          },
        },
      });

      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Profile</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
        Manage your personal and professional information.
      </Typography>

      {message.text && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2,
            borderColor: message.type === 'error' ? 'error.main' : 'success.main',
            color: message.type === 'error' ? 'error.main' : 'success.main',
          }}
        >
          <Typography sx={{ fontSize: '0.9rem' }}>{message.text}</Typography>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Account</Typography>
        <Stack spacing={1.5}>
          <TextField label="Full name" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Personal Information</Typography>
        <Stack spacing={1.5}>
          <TextField
            label="Phone"
            value={formData.personal.phone}
            onChange={handleFieldChange('personal', 'phone')}
            fullWidth
          />
          <TextField
            label="Location"
            value={formData.personal.location}
            onChange={handleFieldChange('personal', 'location')}
            fullWidth
          />
          <TextField
            label="Headline"
            value={formData.personal.headline}
            onChange={handleFieldChange('personal', 'headline')}
            fullWidth
          />
          <TextField
            label="Bio"
            value={formData.personal.bio}
            onChange={handleFieldChange('personal', 'bio')}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Professional Information</Typography>
        <Stack spacing={1.5}>
          <TextField
            label="Current company"
            value={formData.professional.currentCompany}
            onChange={handleFieldChange('professional', 'currentCompany')}
            fullWidth
          />
          <TextField
            label="Years of experience"
            value={formData.professional.yearsOfExperience}
            onChange={handleFieldChange('professional', 'yearsOfExperience')}
            fullWidth
          />
          <TextField
            select
            label="Preferred work type"
            value={formData.professional.workType}
            onChange={handleFieldChange('professional', 'workType')}
            fullWidth
          >
            <MenuItem value="">No preference</MenuItem>
            {WORK_TYPES.map((workType) => (
              <MenuItem key={workType} value={workType}>
                {workType}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Skills"
            helperText="Comma-separated values"
            value={formData.professional.skills}
            onChange={handleFieldChange('professional', 'skills')}
            fullWidth
          />
          <TextField
            label="LinkedIn URL"
            value={formData.professional.linkedinUrl}
            onChange={handleFieldChange('professional', 'linkedinUrl')}
            fullWidth
          />
          <TextField
            label="Portfolio URL"
            value={formData.professional.portfolioUrl}
            onChange={handleFieldChange('professional', 'portfolioUrl')}
            fullWidth
          />
        </Stack>
      </Paper>

      <Button variant="contained" onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Profile'}
      </Button>
    </Box>
  );
}

