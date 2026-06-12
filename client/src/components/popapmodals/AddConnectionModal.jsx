import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';

export default function AddConnectionModal({ open, onClose, onSubmit, initialData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [locationOrCompany, setLocationOrCompany] = useState('');
  const [lastContactedDate, setLastContactedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name || '');
      setRole(initialData?.role || '');
      let parsedContact = {};
      try {
        if (initialData?.contact_details?.startsWith('{')) {
          parsedContact = JSON.parse(initialData.contact_details);
        } else {
          parsedContact = { email: initialData?.contact_details || '' };
        }
      } catch (e) {
        parsedContact = { email: initialData?.contact_details || '' };
      }
      setEmail(parsedContact.email || '');
      setPhone(parsedContact.phone || '');
      setLinkedin(parsedContact.linkedin || '');
      setPortfolioUrl(initialData?.portfolio_url || '');
      setLocationOrCompany(initialData?.location_or_company || '');
      setLastContactedDate(initialData?.last_contacted_date ? initialData.last_contacted_date.split('T')[0] : '');
      setNotes(initialData?.notes || '');
      setError(null);
    }
  }, [open, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name,
        role,
        contact_details: JSON.stringify({ email, phone, linkedin }),
        portfolio_url: portfolioUrl,
        location_or_company: locationOrCompany,
        last_contacted_date: lastContactedDate ? new Date(lastContactedDate).toISOString() : null,
        notes
      });
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to add connection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setLinkedin('');
    setPortfolioUrl('');
    setLocationOrCompany('');
    setLastContactedDate('');
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle>{initialData ? 'Edit Connection' : 'Add New Connection'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              autoFocus
              label="Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
            
            <TextField
              label="Role"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
            
            <TextField
              label="Email Address"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane.doe@example.com"
            />
            
            <TextField
              label="Phone Number"
              fullWidth
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +972523504079"
            />

            <TextField
              label="LinkedIn Profile"
              fullWidth
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="e.g. https://linkedin.com/in/janedoe"
            />

            <TextField
              label="GitHub Repo / Portfolio URL"
              fullWidth
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="e.g. https://github.com/janedoe"
            />
            
            <TextField
              label="Location / Company"
              fullWidth
              value={locationOrCompany}
              onChange={(e) => setLocationOrCompany(e.target.value)}
              placeholder="e.g. Tech Corp / New York"
            />

            <TextField
              label="Last Contacted Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={lastContactedDate}
              onChange={(e) => setLastContactedDate(e.target.value)}
            />
            
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Met at a conference, discussed React architecture..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Connection')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
