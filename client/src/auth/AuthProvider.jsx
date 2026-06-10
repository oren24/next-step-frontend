import { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../api/apiClient.js';

// Global auth context for entire app
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize session from localStorage if available
  const [session, setSession] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser && token) {
      try {
        return { user: JSON.parse(storedUser) };
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const saveSession = (user, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setSession({ user });
  };

  const clearSession = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setSession(null);
  };

  // Sign in with email and password
  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await authApi.login({ email: email.trim().toLowerCase(), password });
      if (response.data) {
        const userWithProvider = { ...response.data.user, authProvider: 'credentials' };
        saveSession(userWithProvider, response.data.token);
        return userWithProvider;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid email or password.');
    }
  }, []);

  // Create new account with email and password
  const signUp = useCallback(async ({ name, email, password }) => {
    try {
      const response = await authApi.register({ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      });
      if (response.data) {
        const userWithProvider = { ...response.data.user, authProvider: 'credentials' };
        saveSession(userWithProvider, response.data.token);
        return userWithProvider;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register account.');
    }
  }, []);

  // Sign in with OAuth provider (Google, LinkedIn, GitHub)
  const signInWithProvider = useCallback(async ({ provider, profile = null }) => {
    const normalizedProvider = String(provider || '').trim().toLowerCase();
    const providerEmail = String(profile?.email || `${normalizedProvider}.demo@nextstep.local`).trim().toLowerCase();
    const providerName = String(profile?.name || `${normalizedProvider} User`).trim();
    
    try {
      const response = await authApi.oauthLogin({ 
        email: providerEmail, 
        name: providerName,
        provider: normalizedProvider
      });
      if (response.data) {
        const userWithProvider = { ...response.data.user, authProvider: normalizedProvider, photoUrl: profile?.picture };
        saveSession(userWithProvider, response.data.token);
        return userWithProvider;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OAuth login failed.');
    }
  }, []);

  const signOut = useCallback(() => {
    clearSession();
  }, []);

  const updateProfile = useCallback(async () => {
    throw new Error('Profile update via API is not fully implemented yet.');
  }, []);

  const changePassword = useCallback(async () => {
    throw new Error('Password change via API is not fully implemented yet.');
  }, []);

  const deleteAccount = useCallback(async () => {
    throw new Error('Account deletion via API is not fully implemented yet.');
  }, []);

  // Build Toolpad session object from user data
  const buildToolpadSession = (user) => {
    if (!user) return null;
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.photoUrl || null,
        authProvider: user.authProvider,
      },
    };
  };

  const value = useMemo(() => ({
    user: session?.user || null,
    isAuthenticated: Boolean(session?.user),
    isLoading: false,
    toolpadSession: buildToolpadSession(session?.user || null),
    toolpadAuthentication: {
      signIn: () => {
        if (globalThis.location.pathname !== '/auth/sign-in') {
          globalThis.location.assign('/auth/sign-in');
        }
      },
      signOut,
    },
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    deleteAccount,
  }), [session, signIn, signInWithProvider, signUp, signOut, updateProfile, changePassword, deleteAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
