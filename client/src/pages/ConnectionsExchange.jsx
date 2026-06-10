import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, Alert, Link } from '@mui/material';
import { connectionsApi } from '../api/apiClient';
import AddConnectionModal from '../components/popapmodals/AddConnectionModal';
import { useAuth } from '../auth/useAuth';

// Fallback initial data in case the backend is down
const fallbackConnections = [
  {
    id: 'mock-1',
    name: 'Jane Doe (Mock)',
    role: 'Senior React Developer',
    contact_details: 'jane@example.com',
    portfolio_url: 'https://github.com/janedoe',
    location_or_company: 'Tech Corp',
    last_contacted_date: '2026-06-01T00:00:00Z',
    notes: 'Met at React Summit.',
  }
];

export default function ConnectionsExchange() {
  const { toolpadSession } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await connectionsApi.getAll();
        setConnections(response.data);
      } catch (err) {
        console.error('Failed to fetch connections:', err);
        if (toolpadSession?.user?.authProvider === 'github') {
          setError('Demo Mode: Showing local mock data.');
          setConnections(fallbackConnections);
        } else {
          setError('Failed to fetch connections from the server.');
          setConnections([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [toolpadSession]);

  const handleAddConnection = async (data) => {
    try {
      const response = await connectionsApi.create(data);
      setConnections([response.data, ...connections]);
    } catch (err) {
      console.error('Failed to add connection via API:', err);
      // Fallback for UI if DB is offline
      const newMockConnection = {
        id: `mock-new-${Date.now()}`,
        ...data
      };
      setConnections([newMockConnection, ...connections]);
      setError('Backend unavailable. Connection added to local UI only.');
    }
  };

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Connections Exchange</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            Manage your professional network and contact details.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setModalOpen(true)}>Add Connection</Button>
      </Stack>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {connections.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', mt: 2 }}>No connections added yet.</Typography>
          ) : (
            connections.map((conn) => (
              <Paper key={conn.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {conn.name}
                  {conn.role && (
                    <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 'normal', ml: 1 }}>
                      • {conn.role}
                    </Typography>
                  )}
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  {conn.contact_details && (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      <strong>Contact:</strong> {conn.contact_details}
                    </Typography>
                  )}
                  {conn.location_or_company && (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      <strong>Company/Location:</strong> {conn.location_or_company}
                    </Typography>
                  )}
                  {conn.last_contacted_date && (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      <strong>Last Contacted:</strong> {new Date(conn.last_contacted_date).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
                
                {conn.portfolio_url && (
                  <Typography sx={{ fontSize: '0.85rem', mb: 1 }}>
                    <strong>Portfolio/GitHub:</strong> <Link href={conn.portfolio_url} target="_blank" rel="noopener">{conn.portfolio_url}</Link>
                  </Typography>
                )}

                {conn.notes && (
                  <Typography sx={{ fontSize: '0.9rem', mt: 1, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                    {conn.notes}
                  </Typography>
                )}
              </Paper>
            ))
          )}
        </Stack>
      )}

      <AddConnectionModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleAddConnection} 
      />
    </Box>
  );
}
