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

const AuthContext = createContext(null);

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

const createUserId = () => {
  if (globalThis.crypto?.randomUUID) {
    return `user_${globalThis.crypto.randomUUID()}`;
  }

  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

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

const SOCIAL_PROVIDER_LABELS = {
  linkedin: 'LinkedIn',
  google: 'Google',
};

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

const ensureDemoUser = (users) => {
  const hasDemoUser = users.some((candidate) => (
    candidate.email?.trim().toLowerCase() === DEMO_USER_EMAIL
  ));

  if (hasDemoUser) return users;
  return [...users, DEMO_USER];
};

const getInitialUsers = () => ensureDemoUser(getStoredUsers());

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

const isCredentialUser = (user) => {
  const provider = user?.authProvider;
  return !provider || provider === 'credentials';
};

const withoutLegacyPassword = (user) => {
  if (!user || !Object.hasOwn(user, 'password')) return user;

  const nextUser = { ...user };
  delete nextUser.password;
  return nextUser;
};

const buildSession = (user) => ({
  user: sanitizeUser(user),
  signedInAt: new Date().toISOString(),
});

const applySession = ({ nextSession, remember, setSession }) => {
  setSession({ ...nextSession, remember });
  setStoredSession(nextSession, remember);
};

const persistUsersState = ({ nextUsers, setUsers }) => {
  setUsers(nextUsers);
  setStoredUsers(nextUsers);
};

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
  const [users, setUsers] = useState(getInitialUsers);
  const [session, setSession] = useState(() => {
    const storedSession = getStoredSession();
    return storedSession?.user ? storedSession : null;
  });

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

    const { passwordValid, nextUserRecord } = await verifyCredentialAndMigrate({
      user: matchedUser,
      password,
    });

    if (!passwordValid) {
      throw new Error('Invalid email or password.');
    }

    if (nextUserRecord !== matchedUser) {
      const nextUsers = [...users];
      nextUsers[matchedIndex] = nextUserRecord;
      persistUsersState({ nextUsers, setUsers });
    }

    const nextSession = buildSession(nextUserRecord);
    applySession({ nextSession, remember, setSession });

    return nextSession.user;
  }, [users]);

  const signUp = useCallback(async ({ name, email, password, remember = true }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const emailTaken = users.some((candidate) => candidate.email === normalizedEmail);
    if (emailTaken) {
      throw new Error('An account with this email already exists.');
    }

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

  const signInWithProvider = useCallback(async ({ provider, remember = true, profile = null }) => {
    const normalizedProvider = String(provider || '').trim().toLowerCase();
    const providerLabel = SOCIAL_PROVIDER_LABELS[normalizedProvider];

    if (!providerLabel) {
      throw new Error(`${provider} sign-in is not configured yet in this frontend-only build.`);
    }

    const providerEmail = String(
      profile?.email || `${normalizedProvider}.demo@nextstep.local`
    ).trim().toLowerCase();
    const providerName = String(profile?.name || `${providerLabel} User`).trim() || `${providerLabel} User`;
    const providerPhotoUrl = String(profile?.picture || '').trim() || null;
    let providerUser = users.find((candidate) => candidate.email === providerEmail);

    if (providerUser?.authProvider && providerUser.authProvider !== normalizedProvider) {
      throw new Error(`This email is already connected to ${providerUser.authProvider} sign-in.`);
    }

    let nextUsers = users;
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

  const updateProfile = useCallback(async ({ name, email }) => {
    if (!session?.user) {
      throw new Error('You need to sign in first.');
    }

    const nextEmail = email.trim().toLowerCase();
    const emailTaken = users.some((candidate) => (
      candidate.id !== session.user.id && candidate.email === nextEmail
    ));

    if (emailTaken) {
      throw new Error('This email is already used by another account.');
    }

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

    persistUsersState({ nextUsers, setUsers });
    setSession(nextSession);
    setStoredSession({ user: updatedUser, signedInAt: session.signedInAt }, session.remember);

    return updatedUser;
  }, [session, users]);

  const changePassword = useCallback(async ({ currentPassword, nextPassword }) => {
    if (!session?.user) {
      throw new Error('You need to sign in first.');
    }

    const currentUser = users.find((candidate) => candidate.id === session.user.id);
    if (!currentUser) {
      throw new Error('Current password is incorrect.');
    }

    if (!isCredentialUser(currentUser)) {
      throw new Error('Password change is only available for email/password accounts.');
    }

    const isCurrentPasswordValid = await verifyCredentialPassword({
      user: currentUser,
      password: currentPassword,
    });

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect.');
    }

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

  const deleteAccount = useCallback(async ({ password }) => {
    if (!session?.user) {
      throw new Error('You need to sign in first.');
    }

    const currentUser = users.find((candidate) => candidate.id === session.user.id);
    if (!currentUser) {
      throw new Error('Password is incorrect.');
    }

    if (!isCredentialUser(currentUser)) {
      throw new Error('Use your social provider to authenticate account deletion in this demo.');
    }

    const isPasswordValid = await verifyCredentialPassword({
      user: currentUser,
      password,
    });

    if (!isPasswordValid) {
      throw new Error('Password is incorrect.');
    }

    const nextUsers = users.filter((candidate) => candidate.id !== session.user.id);
    persistUsersState({ nextUsers, setUsers });
    setSession(null);
    clearStoredSession();
  }, [session, users]);

  const signOut = useCallback(() => {
    setSession(null);
    clearStoredSession();
  }, []);

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

