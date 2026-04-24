import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import { ThemeToggle } from '../../components/layout/TopBarUtils.jsx';

export default function SignUp({ isDarkMode, onToggleTheme }) {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({ name, email, password, remember });
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
        <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Stack alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonAddAlt1Icon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Create your account
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Start tracking your applications with your own workspace.
            </Typography>
          </Stack>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            label="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
            helperText="Use at least 8 characters."
          />
          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            fullWidth
          />

          <FormControlLabel
            control={(
              <Checkbox
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
            )}
            label="Keep me signed in"
          />

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/auth/sign-in" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

SignUp.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

