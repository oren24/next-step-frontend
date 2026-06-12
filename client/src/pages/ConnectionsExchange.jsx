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
  const [editingConnection, setEditingConnection] = useState(null);

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

  const handleConnectionSubmit = async (data) => {
    try {
      if (editingConnection) {
        const response = await connectionsApi.update(editingConnection.id, data);
        setConnections(connections.map(c => c.id === editingConnection.id ? response.data : c));
      } else {
        const response = await connectionsApi.create(data);
        setConnections([response.data, ...connections]);
      }
    } catch (err) {
      console.error('Failed to save connection via API:', err);
      // Fallback for UI if DB is offline
      if (editingConnection) {
        setConnections(connections.map(c => c.id === editingConnection.id ? { ...c, ...data } : c));
        setError('Backend unavailable. Connection updated locally.');
      } else {
        const newMockConnection = { id: `mock-new-${Date.now()}`, ...data };
        setConnections([newMockConnection, ...connections]);
        setError('Backend unavailable. Connection added locally.');
      }
    }
  };

  const handleDeleteConnection = async (conn) => {
    if (!window.confirm(`Are you sure you want to delete ${conn.name}?`)) return;
    try {
      if (!conn.id.toString().startsWith('mock-')) {
        await connectionsApi.delete(conn.id);
      }
      setConnections(connections.filter(c => c.id !== conn.id));
    } catch (err) {
      console.error('Failed to delete connection:', err);
      setError('Failed to delete connection. Please try again.');
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
        <Button variant="contained" onClick={() => { setEditingConnection(null); setModalOpen(true); }}>Add Connection</Button>
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
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {conn.name}
                    {conn.role && (
                      <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 'normal', ml: 1 }}>
                        • {conn.role}
                      </Typography>
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => { setEditingConnection(conn); setModalOpen(true); }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteConnection(conn)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
                
                <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 1, flexWrap: 'wrap', gap: 1 }}>
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
                
                {conn.contact_details && (
                  <Box sx={{ mb: 1.5 }}>
                    {(() => {
                      let parsedContact = null;
                      if (conn.contact_details.startsWith('{')) {
                        try { parsedContact = JSON.parse(conn.contact_details); } catch (e) {}
                      }
                      
                      if (parsedContact) {
                        return (
                          <Stack spacing={0.5}>
                            {parsedContact.email && (
                              <Typography sx={{ fontSize: '0.85rem' }}>
                                <strong>Email:</strong> <Link href={`mailto:${parsedContact.email}`}>{parsedContact.email}</Link>
                              </Typography>
                            )}
                            {parsedContact.phone && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography sx={{ fontSize: '0.85rem' }}>
                                  <strong>Phone:</strong> {parsedContact.phone}
                                </Typography>
                                <Button 
                                  variant="contained" 
                                  color="success" 
                                  size="small"
                                  href={`https://wa.me/${parsedContact.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  sx={{ py: 0, px: 1, minWidth: 'auto', textTransform: 'none', fontSize: '0.75rem', borderRadius: 4 }}
                                >
                                  WhatsApp
                                </Button>
                              </Stack>
                            )}
                            {parsedContact.linkedin && (
                              <Typography sx={{ fontSize: '0.85rem' }}>
                                <strong>LinkedIn:</strong> <Link href={parsedContact.linkedin.startsWith('http') ? parsedContact.linkedin : `https://${parsedContact.linkedin}`} target="_blank" rel="noopener">{parsedContact.linkedin}</Link>
                              </Typography>
                            )}
                          </Stack>
                        );
                      } else {
                        return (
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                            <strong>Contact:</strong> {conn.contact_details}
                          </Typography>
                        );
                      }
                    })()}
                  </Box>
                )}

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
        onClose={() => { setModalOpen(false); setEditingConnection(null); }} 
        onSubmit={handleConnectionSubmit} 
        initialData={editingConnection}
      />
    </Box>
  );
}
