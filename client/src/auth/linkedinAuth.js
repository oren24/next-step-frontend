export const signInWithLinkedInPopup = async ({ clientId }) => {
  const normalizedClientId = String(clientId || import.meta.env.VITE_LINKEDIN_CLIENT_ID || '').trim();
  
  if (!normalizedClientId) {
    console.warn('LinkedIn sign-in is not configured. Missing VITE_LINKEDIN_CLIENT_ID. Falling back to mock authentication.');
    // Simulate network delay for the popup flow
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      id: 'linkedin_mock_user_123',
      email: 'user@linkedin-mock.local',
      name: 'LinkedIn Mock User',
      picture: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    };
  }

  return new Promise((resolve, reject) => {
    // Generate a random state string to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15);
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    
    // LinkedIn OAuth 2.0 Authorization Endpoint
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(normalizedClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=openid%20profile%20email`;

    // Open a popup window for the LinkedIn login page
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      authUrl,
      'LinkedIn Sign In',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    // Monitor the popup to check if it has redirected back to our app with the code
    const timer = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(timer);
          reject(new Error('LinkedIn sign-in was cancelled.'));
          return;
        }

        // Check if the popup's URL has changed to our redirect URI
        const currentUrl = popup.location.href;
        if (currentUrl.startsWith(redirectUri)) {
          clearInterval(timer);
          const urlParams = new URL(currentUrl).searchParams;
          const code = urlParams.get('code');
          const returnedState = urlParams.get('state');

          if (returnedState !== state) {
            popup.close();
            reject(new Error('Invalid state parameter returned from LinkedIn.'));
            return;
          }

          if (code) {
            popup.close();
            
            // Send the authorization code to our backend to exchange for an access token
            const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
            try {
              const response = await fetch(`${API_BASE_URL}/linkedin/exchange-token`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, redirectUri })
              });

              const profile = await response.json();
              
              if (!response.ok) {
                throw new Error(profile.message || 'Failed to exchange LinkedIn token');
              }

              resolve(profile);
            } catch (err) {
              console.error('LinkedIn token exchange error:', err);
              reject(new Error('Backend token exchange failed.'));
            }
          } else {
            popup.close();
            reject(new Error('LinkedIn authorization failed. No code received.'));
          }
        }
      } catch (error) {
        // Ignore CORS errors while the popup is on linkedin.com
      }
    }, 500);
  });
};
