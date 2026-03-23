import PropTypes from 'prop-types';
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useAuth } from '../../auth/useAuth.js';
import { signInWithGooglePopup } from '../../auth/googleAuth.js';
import { ThemeToggle } from '../../components/layout/TopBarUtils.jsx';

function SignUpPromptLink() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Don&apos;t have an account?{' '}
      <Link component={RouterLink} to="/auth/sign-up" underline="hover">
        Sign up
      </Link>
    </Typography>
  );
}

export default function SignIn({ isDarkMode, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithProvider } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const redirectPath = location.state?.from?.pathname || '/';

  const providers = [
    { id: 'credentials', name: 'Email and Password' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'google', name: 'Google' },
    { id: 'github', name: 'GitHub' },
  ];

  const handleSignIn = async (provider, formData) => {
    if (provider.id === 'credentials') {
      const email = String(formData?.get('email') || '').trim();
      const password = String(formData?.get('password') || '');
      const remember = formData?.get('remember') === 'on';

      try {
        await signIn({ email, password, remember });
        navigate(redirectPath, { replace: true });
        return {};
      } catch (error) {
        return { error: error.message || 'Unable to sign in.' };
      }
    }

    if (provider.id === 'linkedin') {
      try {
        await signInWithProvider({ provider: 'linkedin', remember: true });
        navigate(redirectPath, { replace: true });
        return {};
      } catch (error) {
        return { error: error.message || 'Unable to sign in with LinkedIn.' };
      }
    }

    if (provider.id === 'google') {
      try {
        const googleProfile = await signInWithGooglePopup({ clientId: googleClientId });
        await signInWithProvider({ provider: 'google', remember: true, profile: googleProfile });
        navigate(redirectPath, { replace: true });
        return {};
      } catch (error) {
        return { error: error.message || 'Unable to sign in with Google.' };
      }
    }

    if (provider.id !== 'credentials') {
      return {
        error: `${provider.name} sign-in is not configured yet in this frontend-only build.`,
      };
    }

    return { error: 'Unsupported sign-in provider.' };
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 2 }}>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </Box>
      <SignInPage
        signIn={handleSignIn}
        providers={providers}
        sx={{
          minHeight: 'auto',
          pt: { xs: 10, sm: 12 },
          pb: 0,
        }}
        localeText={{
          signInTitle: 'Sign in to Nextstep',
          signInSubtitle: 'Use your account to manage your job applications.',
        }}
        slotProps={{
          emailField: { autoFocus: true },
          rememberMe: { label: 'Remember me on this device' },
        }}
        slots={{
          signUpLink: SignUpPromptLink,
        }}
      />
    </Box>
  );
}

SignIn.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

