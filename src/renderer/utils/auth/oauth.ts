/**
 * OAuth 2.0 configuration for Atlassian
 */
export const ATLASSIAN_OAUTH_CONFIG = {
  authorizationEndpoint: 'https://auth.atlassian.com/authorize',
  tokenEndpoint: 'https://auth.atlassian.com/oauth/token',
  clientId: '', // To be configured by user
  redirectUri: 'http://localhost:3000/callback', // Local callback server
  scopes: [
    'read:me', // User profile information
    'read:account', // Account details
    'offline_access', // Refresh token
  ],
};

/**
 * OAuth 2.0 error types
 */
export type OAuthError =
  | 'USER_CANCELLED'
  | 'INVALID_REQUEST'
  | 'ACCESS_DENIED'
  | 'NETWORK_ERROR'
  | 'TOKEN_EXCHANGE_FAILED'
  | 'UNKNOWN';

/**
 * OAuth 2.0 error details
 */
export interface OAuthErrorDetails {
  type: OAuthError;
  message: string;
  originalError?: Error;
}

/**
 * PKCE (Proof Key for Code Exchange) utilities
 */
export class PKCEUtils {
  /**
   * Generate a cryptographically random code verifier
   */
  static generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return PKCEUtils.base64URLEncode(array);
  }

  /**
   * Generate code challenge from verifier using SHA-256
   */
  static async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return PKCEUtils.base64URLEncode(new Uint8Array(hash));
  }

  /**
   * Base64 URL encode without padding
   */
  private static base64URLEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}

/**
 * Generate OAuth authorization URL with PKCE
 */
export async function generateAuthorizationUrl(
  clientId: string,
  redirectUri: string,
  scopes: string[],
): Promise<{ url: string; codeVerifier: string; state: string }> {
  const codeVerifier = PKCEUtils.generateCodeVerifier();
  const codeChallenge = await PKCEUtils.generateCodeChallenge(codeVerifier);
  const state = PKCEUtils.generateCodeVerifier(); // Random state for CSRF protection

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    audience: 'api.atlassian.com',
    prompt: 'consent',
  });

  const url = `${ATLASSIAN_OAUTH_CONFIG.authorizationEndpoint}?${params.toString()}`;

  return { url, codeVerifier, state };
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  clientId: string,
  redirectUri: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const response = await fetch(ATLASSIAN_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Token exchange failed: ${response.status} - ${errorData.error_description || response.statusText}`,
    );
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(ATLASSIAN_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Token refresh failed: ${response.status} - ${errorData.error_description || response.statusText}`,
    );
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken, // Some providers don't return new refresh token
    expiresIn: data.expires_in,
  };
}

/**
 * Get user information from access token
 */
export async function getUserInfo(
  accessToken: string,
): Promise<{ accountId: string; email: string; name: string }> {
  const response = await fetch('https://api.atlassian.com/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  const data = await response.json();

  return {
    accountId: data.account_id,
    email: data.email,
    name: data.name,
  };
}
