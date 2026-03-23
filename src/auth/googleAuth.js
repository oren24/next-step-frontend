const GOOGLE_IDENTITY_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo';

let googleScriptPromise = null;

const ensureGoogleSdkLoaded = async () => {
  if (globalThis.google?.accounts?.oauth2) {
    return;
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Unable to load Google Sign-In SDK.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Google Sign-In SDK.'));
      document.head.appendChild(script);
    });
  }

  await googleScriptPromise;
};

const requestGoogleAccessToken = async ({ clientId }) => {
  await ensureGoogleSdkLoaded();

  return new Promise((resolve, reject) => {
    const tokenClient = globalThis.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      prompt: 'select_account',
      callback: (response) => {
        if (!response?.access_token) {
          reject(new Error(response?.error_description || response?.error || 'Google sign-in failed.'));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: () => {
        reject(new Error('Google sign-in was cancelled.'));
      },
    });

    tokenClient.requestAccessToken();
  });
};

const fetchGoogleProfile = async (accessToken) => {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch Google profile information.');
  }

  const profile = await response.json();
  if (!profile?.email) {
    throw new Error('Google account did not return an email address.');
  }

  return {
    id: profile.sub || null,
    email: String(profile.email).trim().toLowerCase(),
    name: String(profile.name || profile.email || 'Google User').trim(),
    picture: profile.picture || null,
  };
};

export const signInWithGooglePopup = async ({ clientId }) => {
  const normalizedClientId = String(clientId || '').trim();
  if (!normalizedClientId) {
    throw new Error('Google sign-in is not configured. Missing VITE_GOOGLE_CLIENT_ID.');
  }

  const accessToken = await requestGoogleAccessToken({ clientId: normalizedClientId });
  return fetchGoogleProfile(accessToken);
};
