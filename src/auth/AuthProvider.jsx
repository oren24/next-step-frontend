import { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  clearStoredSession,
  getStoredSession,
  getStoredUsers,
  setStoredSession,
  setStoredUsers,
} from './authStorage.js';
import { hashPassword, verifyPassword } from './passwordCrypto.js';

// Global auth context for entire app
const AuthContext = createContext(null);

// Remove sensitive fields from user object for safe exposure to UI
const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl || null,
    createdAt: user.createdAt,
  };
};

// Generate unique user ID using crypto API or fallback
const createUserId = () => {
  if (globalThis.crypto?.randomUUID) {
    return `user_${globalThis.crypto.randomUUID()}`;
  }

  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

// Create new user object with defaults
const buildUser = ({
  name,
  email,
  authProvider = 'credentials',
  passwordHash = null,
  photoUrl = null,
}) => ({
  id: createUserId(),
  name: name.trim(),
  email: email.trim().toLowerCase(),
  authProvider,
  passwordHash,
  photoUrl,
  createdAt: new Date().toISOString(),
});

// Map provider names to display labels
const SOCIAL_PROVIDER_LABELS = {
  linkedin: 'LinkedIn',
  google: 'Google',
};

// Demo account credentials for quick testing
const DEMO_USER_EMAIL = 'demo@nextstep.local';
const DEMO_USER = {
  id: 'user_demo_nextstep',
  name: 'Nextstep Demo User',
  email: DEMO_USER_EMAIL,
  authProvider: 'credentials',
  passwordHash: {
    algorithm: 'PBKDF2-SHA256',
    iterations: 210000,
    salt: 'bmV4dHN0ZXAtZGVtby1zYWx0',
    hash: 'LQ3XnvzLZFB+bB6EI98kYaoVPdEUGFOiRNljcGlUqvg=',
  },
  createdAt: '2026-03-22T00:00:00.000Z',
};

// Ensure demo account exists in user list (seed if missing)
const ensureDemoUser = (users) => {
  const hasDemoUser = users.some((candidate) => (
    candidate.email?.trim().toLowerCase() === DEMO_USER_EMAIL
  ));

  if (hasDemoUser) return users;
  return [...users, DEMO_USER];
};

// Load users from storage with demo account fallback
const getInitialUsers = () => ensureDemoUser(getStoredUsers());

// Build Toolpad session object from user data
const buildToolpadSession = (user) => {
  if (!user) return null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.photoUrl || null,
    },
  };
};

// Check if user is a credentials (email/password) account
const isCredentialUser = (user) => {
  const provider = user?.authProvider;
  return !provider || provider === 'credentials';
};

// Remove legacy plaintext password field
const withoutLegacyPassword = (user) => {
  if (!user || !Object.hasOwn(user, 'password')) return user;

  const nextUser = { ...user };
  delete nextUser.password;
  return nextUser;
};

// Build session object with sanitized user data
const buildSession = (user) => ({
  user: sanitizeUser(user),
  signedInAt: new Date().toISOString(),
});

// Save session and update storage
const applySession = ({ nextSession, remember, setSession }) => {
  setSession({ ...nextSession, remember });
  setStoredSession(nextSession, remember);
};

// Save users and update storage
const persistUsersState = ({ nextUsers, setUsers }) => {
  setUsers(nextUsers);
  setStoredUsers(nextUsers);
};



// Verify password and migrate from plaintext to hashed if needed
const verifyCredentialAndMigrate = async ({ user, password }) => {
  if (user.passwordHash) {
    const passwordValid = await verifyPassword(password, user.passwordHash);
    return {
      passwordValid,
      nextUserRecord: withoutLegacyPassword(user),
    };
  }

  if (typeof user.password !== 'string') {
    return { passwordValid: false, nextUserRecord: user };
  }

  const passwordValid = user.password === password;
  if (!passwordValid) {
    return { passwordValid: false, nextUserRecord: user };
  }

  // Upgrade plaintext password to hash
  const migratedHash = await hashPassword(password);
  return {
    passwordValid: true,
    nextUserRecord: {
      ...withoutLegacyPassword(user),
      authProvider: 'credentials',
      passwordHash: migratedHash,
      passwordUpgradedAt: new Date().toISOString(),
    },
  };
};

// Verify password for credential users (handles both hashed and legacy plaintext)
const verifyCredentialPassword = async ({ user, password }) => {
  if (user.passwordHash) {
    return verifyPassword(password, user.passwordHash);
  }

  if (typeof user.password === 'string') {
    return user.password === password;
  }

  return false;
};

export function AuthProvider({ children }) {
  // Initialize users from localStorage with demo account fallback
  const [users, setUsers] = useState(getInitialUsers);

  // Initialize session from localStorage if available
  const [session, setSession] = useState(() => {
    const storedSession = getStoredSession();
    return storedSession?.user ? storedSession : null;
  });

  // Sign in with email and password
  const signIn = useCallback(async ({ email, password, remember = true }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedIndex = users.findIndex((candidate) => candidate.email === normalizedEmail);
    const matchedUser = matchedIndex >= 0 ? users[matchedIndex] : null;

    if (!matchedUser) {
      throw new Error('Invalid email or password.');
    }

    if (!isCredentialUser(matchedUser)) {
      throw new Error('This account uses social sign-in. Please use the provider button.');
    }

    // Verify password and upgrade if needed
    const { passwordValid, nextUserRecord } = await verifyCredentialAndMigrate({
      user: matchedUser,
      password,
    });

    if (!passwordValid) {
      throw new Error('Invalid email or password.');
    }

    // Save migrated user record if password was upgraded
    if (nextUserRecord !== matchedUser) {
      const nextUsers = [...users];
      nextUsers[matchedIndex] = nextUserRecord;
      persistUsersState({ nextUsers, setUsers });
    }

    const nextSession = buildSession(nextUserRecord);
    applySession({ nextSession, remember, setSession });

    return nextSession.user;
  }, [users]);

  // Create new account with email and password
  const signUp = useCallback(async ({ name, email, password, remember = true }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const emailTaken = users.some((candidate) => candidate.email === normalizedEmail);
    if (emailTaken) {
      throw new Error('An account with this email already exists.');
    }

    // Create new user with hashed password
    const passwordHash = await hashPassword(password);
    const newUser = buildUser({
      name,
      email: normalizedEmail,
      authProvider: 'credentials',
      passwordHash,
    });
    const nextUsers = [...users, newUser];
    persistUsersState({ nextUsers, setUsers });

    const nextSession = buildSession(newUser);
    applySession({ nextSession, remember, setSession });

    return nextSession.user;
  }, [users]);

  // Sign in with OAuth provider (Google, LinkedIn, etc.)
  const signInWithProvider = useCallback(async ({ provider, remember = true, profile = null }) => {
    const normalizedProvider = String(provider || '').trim().toLowerCase();
    const providerLabel = SOCIAL_PROVIDER_LABELS[normalizedProvider];

    // Check if provider is configured
    if (!providerLabel) {
      throw new Error(`${provider} sign-in is not configured yet in this frontend-only build.`);
    }

    const providerEmail = String(
      profile?.email || `${normalizedProvider}.demo@nextstep.local`
    ).trim().toLowerCase();
    const providerName = String(profile?.name || `${providerLabel} User`).trim() || `${providerLabel} User`;
    const providerPhotoUrl = String(profile?.picture || '').trim() || null;
    let providerUser = users.find((candidate) => candidate.email === providerEmail);

    // Prevent account takeover: email already linked to different provider
    if (providerUser?.authProvider && providerUser.authProvider !== normalizedProvider) {
      throw new Error(`This email is already connected to ${providerUser.authProvider} sign-in.`);
    }

    let nextUsers = users;

    // Create new account if user doesn't exist
    if (!providerUser) {
      providerUser = buildUser({
        name: providerName,
        email: providerEmail,
        authProvider: normalizedProvider,
        passwordHash: null,
        photoUrl: providerPhotoUrl,
      });
      nextUsers = [...users, providerUser];
      persistUsersState({ nextUsers, setUsers });
    } else if (providerUser.name !== providerName || providerUser.photoUrl !== providerPhotoUrl) {
      // Update profile if it changed
      const matchedIndex = users.findIndex((candidate) => candidate.id === providerUser.id);
      if (matchedIndex >= 0) {
        const refreshedProviderUser = {
          ...providerUser,
          name: providerName,
          photoUrl: providerPhotoUrl,
        };
        nextUsers = [...users];
        nextUsers[matchedIndex] = refreshedProviderUser;
        providerUser = refreshedProviderUser;
        persistUsersState({ nextUsers, setUsers });
      }
    }

    const nextSession = buildSession(providerUser);
    applySession({ nextSession, remember, setSession });

    return nextSession.user;
  }, [users]);

  // Update user profile (name and email)
  const updateProfile = useCallback(async ({ name, email }) => {
    if (!session?.user) {
      throw new Error('You need to sign in first.');
    }

    const nextEmail = email.trim().toLowerCase();

    // Check if new email is already in use by another account
    const emailTaken = users.some((candidate) => (
      candidate.id !== session.user.id && candidate.email === nextEmail
    ));

    if (emailTaken) {
      throw new Error('This email is already used by another account.');
    }

    // Update user record
    const nextUsers = users.map((candidate) => {
      if (candidate.id !== session.user.id) return candidate;
      return {
        ...candidate,
        name: name.trim(),
        email: nextEmail,
      };
    });

    const updatedUser = sanitizeUser(nextUsers.find((candidate) => candidate.id === session.user.id));
    const nextSession = {
      ...session,
      user: updatedUser,
    };

    // Sync to storage
    persistUsersState({ nextUsers, setUsers });
    setSession(nextSession);
    setStoredSession({ user: updatedUser, signedInAt: session.signedInAt }, session.remember);

    return updatedUser;
  }, [session, users]);

  // Change password for credential accounts only
  const changePassword = useCallback(async ({ currentPassword, nextPassword }) => {
    if (!session?.user) {
      throw new Error('You need to sign in first.');
    }

    const currentUser = users.find((candidate) => candidate.id === session.user.id);
    if (!currentUser) {
      throw new Error('Current password is incorrect.');
    }

    // Only credential users can change password
    if (!isCredentialUser(currentUser)) {
      throw new Error('Password change is only available for email/password accounts.');
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyCredentialPassword({
      user: currentUser,
      password: currentPassword,
    });

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect.');
    }

    // Hash and save new password
    const nextPasswordHash = await hashPassword(nextPassword);

    const nextUsers = users.map((candidate) => (
      candidate.id === session.user.id
        ? {
            ...withoutLegacyPassword(candidate),
            authProvider: 'credentials',
            passwordHash: nextPasswordHash,
            passwordUpdatedAt: new Date().toISOString(),
          }
        : candidate
    ));

    persistUsersState({ nextUsers, setUsers });
  }, [session, users]);

  // Delete account (credential accounts only)
  const deleteAccount = useCallback(async ({ password }) => {
    if (!session?.user) {
      throw new Error('You need to sign in first.');
    }

    const currentUser = users.find((candidate) => candidate.id === session.user.id);
    if (!currentUser) {
      throw new Error('Password is incorrect.');
    }

    // Only credential users can delete account
    if (!isCredentialUser(currentUser)) {
      throw new Error('Use your social provider to authenticate account deletion in this demo.');
    }

    // Verify password before deletion
    const isPasswordValid = await verifyCredentialPassword({
      user: currentUser,
      password,
    });

    if (!isPasswordValid) {
      throw new Error('Password is incorrect.');
    }

    // Remove user from list
    const nextUsers = users.filter((candidate) => candidate.id !== session.user.id);
    persistUsersState({ nextUsers, setUsers });

    // Clear session
    setSession(null);
    clearStoredSession();
  }, [session, users]);

  // Sign out and clear session
  const signOut = useCallback(() => {
    setSession(null);
    clearStoredSession();
  }, []);

  // Build context value with all auth methods and state
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
  }), [
    session,
    signOut,
    signIn,
    signInWithProvider,
    signUp,
    updateProfile,
    changePassword,
    deleteAccount,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;

