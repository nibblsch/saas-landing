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