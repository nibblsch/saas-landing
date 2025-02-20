// pages/auth.tsx
import { useEffect } from 'react';

export default function Auth() {
  useEffect(() => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/auth/callback' // or your deployment URL
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.send'],
      prompt: 'consent'
    });

    window.location.href = authUrl;
  }, []);

  return <div>Redirecting to Google...</div>;
}

// pages/auth/callback.tsx
import { useEffect } from 'react';
import { google } from 'googleapis';

export default function AuthCallback() {
  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'http://localhost:3000/auth/callback'
        );

        try {
          const { tokens } = await oauth2Client.getToken(code);
          console.log('Refresh Token:', tokens.refresh_token);
          // Store this refresh_token in your .env file
        } catch (error) {
          console.error('Error getting tokens:', error);
        }
      }
    };

    getToken();
  }, []);

  return <div>Processing authentication...</div>;
}