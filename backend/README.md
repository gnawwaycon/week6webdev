# Backend Configuration

## Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session
COOKIE_KEY=your_session_secret_key

# Gemini AI API
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for OAuth redirect after login)
FRONTEND_URL=https://your-frontend-domain.com

# Google OAuth Callback URL (for production)
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/auth/google/callback
```

## OAuth Configuration

### For Local Development:
- `FRONTEND_URL=http://localhost:3000`
- `GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback`

### For Production:
- `FRONTEND_URL=https://your-frontend-domain.com`
- `GOOGLE_CALLBACK_URL=https://your-backend-domain.com/auth/google/callback`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set the authorized redirect URIs to include your production callback URL
6. Copy the Client ID and Client Secret to your `.env` file

## Important Notes

- The `FRONTEND_URL` should be the exact URL where your frontend is deployed
- The `GOOGLE_CALLBACK_URL` should match what you configure in Google Cloud Console
- Make sure your backend domain is HTTPS in production (required for OAuth)
- The session cookie is configured for cross-site usage with `sameSite: 'none'` and `secure: true` 