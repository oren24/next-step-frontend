import express from 'express';

const router = express.Router();

/**
 * POST /api/linkedin/exchange-token
 * Exchange authorization code for access token and fetch user profile
 */
router.post('/exchange-token', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code || !redirectUri) {
      return res.status(400).json({ message: 'Code and redirectUri are required' });
    }

    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET
    });

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(tokenResponse.status).json({ message: 'Failed to exchange token', details: tokenData });
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileData);
      return res.status(profileResponse.status).json({ message: 'Failed to fetch profile', details: profileData });
    }

    // 3. Format to our standard profile object
    const profile = {
      id: profileData.sub,
      email: profileData.email,
      name: profileData.name || `${profileData.given_name} ${profileData.family_name}`.trim(),
      picture: profileData.picture || 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    };

    res.json(profile);
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    res.status(500).json({ message: 'Internal server error during LinkedIn auth' });
  }
});

export default router;
