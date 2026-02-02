# OAuth 2.0 Authentication in Atlassify

This document provides technical details about the OAuth 2.0 implementation in Atlassify.

## Overview

Atlassify uses **OAuth 2.0 with PKCE** (Proof Key for Code Exchange) for secure authentication with Atlassian. This implementation follows the authorization code flow recommended for desktop applications.

## Architecture

### Components

1. **Renderer Process (`src/renderer/utils/auth/oauth.ts`)**
   - OAuth configuration and constants
   - PKCE utilities (code verifier/challenge generation)
   - Token exchange functions
   - User info retrieval

2. **Main Process (`src/main/oauth.ts`)**
   - Local HTTP callback server (port 3000)
   - OAuth flow orchestration
   - Browser window management
   - IPC communication handlers

3. **Preload Bridge (`src/preload/index.ts`)**
   - Exposes OAuth API to renderer via IPC
   - Type-safe communication layer

### Authentication Flow

```
1. User clicks "Sign in with Atlassian"
   ↓
2. Renderer generates PKCE parameters
   ↓
3. Main process starts local callback server
   ↓
4. Authorization URL opens in default browser
   ↓
5. User authenticates with Atlassian
   ↓
6. Atlassian redirects to http://localhost:3000/callback
   ↓
7. Callback server receives authorization code
   ↓
8. Renderer exchanges code for access/refresh tokens
   ↓
9. Tokens are encrypted and stored securely
   ↓
10. User is authenticated ✓
```

## Security Features

### PKCE (RFC 7636)

PKCE protects against authorization code interception attacks:

- **Code Verifier**: Cryptographically random 43-character string
- **Code Challenge**: SHA-256 hash of the verifier, base64url encoded
- **Flow**: Challenge sent with auth request, verifier sent with token request

### Token Storage

- Access tokens encrypted using Electron's `safeStorage` API
- Refresh tokens also encrypted and stored separately
- Platform-specific secure storage:
  - **macOS**: Keychain
  - **Windows**: Credential Manager
  - **Linux**: libsecret/gnome-keyring

### State Parameter

- Random state value prevents CSRF attacks
- Verified on callback to ensure request originated from Atlassify

## API Scopes

The following OAuth scopes are requested:

| Scope | Purpose |
|-------|---------|
| `read:me` | Get user profile information |
| `read:account` | Access account details |
| `offline_access` | Obtain refresh tokens for persistent access |

## Token Refresh

Access tokens expire after a set period (typically 1 hour). The refresh flow:

1. API request fails with 401 Unauthorized
2. Refresh token is used to obtain new access token
3. New tokens are encrypted and stored
4. Original request is retried with new access token

## Configuration

### OAuth App Setup

Users must create their own OAuth 2.0 (3LO) app in Atlassian Developer Console:

1. App type: **OAuth 2.0 integration**
2. Callback URL: `http://localhost:3000/callback`
3. Required scopes: `read:me`, `read:account`, `offline_access`

### Environment-Specific Settings

The OAuth client ID is currently hardcoded as a placeholder (`YOUR_OAUTH_CLIENT_ID`). In a production implementation, this could be:

- Configured per-user in settings
- Distributed as part of an official Atlassify OAuth app (requires publishing)
- Set via environment variable for enterprise deployments

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `USER_CANCELLED` | User closed browser or denied permissions | User can retry |
| `INVALID_REQUEST` | Malformed OAuth parameters | Check configuration |
| `ACCESS_DENIED` | User denied permissions | User must grant permissions |
| `TOKEN_EXCHANGE_FAILED` | Code exchange failed | Check client ID and callback URL |
| `NETWORK_ERROR` | Network connectivity issues | Check internet connection |

### Timeout

The OAuth flow times out after 5 minutes if the user doesn't complete authentication.

## Testing

### Manual Testing

1. Create test OAuth app in Atlassian Developer Console
2. Update client ID in `src/renderer/routes/Login.tsx`
3. Start Atlassify in development mode
4. Test OAuth flow end-to-end

### Automated Testing

- Mock OAuth responses in tests using `jest.mock()`
- Test PKCE generation and validation
- Test token exchange logic
- Test error scenarios

## Future Enhancements

- [ ] Configurable OAuth client ID in settings
- [ ] Official Atlassify OAuth app (if published to store)
- [ ] Silent token refresh in background
- [ ] Multiple account support with OAuth
- [ ] Revoke token functionality
- [ ] OAuth scope management UI

## References

- [Atlassian OAuth 2.0 (3LO) Documentation](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/)
- [RFC 6749: OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636: PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
