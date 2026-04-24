const USERS_KEY = 'nextstep.auth.users';
const SESSION_KEY = 'nextstep.auth.session';
const SESSION_MAX_AGE_SESSION_MS = 12 * 60 * 60 * 1000; // 12h (session storage)
const SESSION_MAX_AGE_REMEMBER_MS = 30 * 24 * 60 * 60 * 1000; // 30d (local storage)

const readJson = (storage, key, fallback) => {
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (storage, key, value) => {
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

const isValidSignedInAt = (signedInAt) => {
  if (!signedInAt) return false;
  const timestamp = Date.parse(signedInAt);
  return Number.isFinite(timestamp);
};

const isExpiredSession = (session, maxAgeMs) => {
  if (!isValidSignedInAt(session?.signedInAt)) return true;

  const signedInAtMs = Date.parse(session.signedInAt);
  return Date.now() - signedInAtMs > maxAgeMs;
};

export const getStoredUsers = () => readJson(globalThis.localStorage, USERS_KEY, []);

export const setStoredUsers = (users) => {
  writeJson(globalThis.localStorage, USERS_KEY, users);
};

export const getStoredSession = () => {
  const fromSessionStorage = readJson(globalThis.sessionStorage, SESSION_KEY, null);
  if (fromSessionStorage) {
    if (isExpiredSession(fromSessionStorage, SESSION_MAX_AGE_SESSION_MS)) {
      globalThis.sessionStorage?.removeItem(SESSION_KEY);
      return null;
    }
    return { ...fromSessionStorage, remember: false };
  }

  const fromLocalStorage = readJson(globalThis.localStorage, SESSION_KEY, null);
  if (fromLocalStorage) {
    if (isExpiredSession(fromLocalStorage, SESSION_MAX_AGE_REMEMBER_MS)) {
      globalThis.localStorage?.removeItem(SESSION_KEY);
      return null;
    }
    return { ...fromLocalStorage, remember: true };
  }

  return null;
};

export const setStoredSession = (session, remember = true) => {
  const targetStorage = remember ? globalThis.localStorage : globalThis.sessionStorage;
  const otherStorage = remember ? globalThis.sessionStorage : globalThis.localStorage;
  const persistedSession = {
    ...session,
    signedInAt: isValidSignedInAt(session?.signedInAt)
      ? session.signedInAt
      : new Date().toISOString(),
  };

  writeJson(targetStorage, SESSION_KEY, persistedSession);
  if (otherStorage) {
    otherStorage.removeItem(SESSION_KEY);
  }
};

export const clearStoredSession = () => {
  globalThis.localStorage?.removeItem(SESSION_KEY);
  globalThis.sessionStorage?.removeItem(SESSION_KEY);
};

