import type http from 'node:http';

import { shell } from 'electron';

import type { IOAuthFlowRequest } from '../shared/events';
import { EVENTS } from '../shared/events';
import { logError, logInfo } from '../shared/logger';

import { handleMainEvent } from './events';

/**
 * OAuth configuration constants
 */
const OAUTH_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_OAUTH_PORT = 3000;

/**
 * OAuth flow state
 */
interface OAuthFlowState {
  codeVerifier: string;
  state: string;
  resolve: (value: { code: string; state: string }) => void;
  reject: (error: Error) => void;
}

let currentFlow: OAuthFlowState | null = null;
let callbackServer: http.Server | null = null;

/**
 * Generate a cryptographically random string
 */
function generateRandomString(length = 43): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join('');
}

/**
 * Base64 URL encode
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate code challenge from verifier
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(Buffer.from(hashBuffer));
}

/**
 * Start a local HTTP server to handle OAuth callback
 */
function startCallbackServer(port: number): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    // Dynamically import http to avoid bundling issues
    import('node:http')
      .then((http) => {
        const server = http.createServer((req, res) => {
          if (!req.url) {
            res.writeHead(400);
            res.end('Bad Request');
            return;
          }

          const url = new URL(req.url, `http://localhost:${port}`);

          if (url.pathname === '/callback') {
            const code = url.searchParams.get('code');
            const state = url.searchParams.get('state');
            const error = url.searchParams.get('error');
            const errorDescription = url.searchParams.get('error_description');

            if (error) {
              logError('oauth', `OAuth error: ${error} - ${errorDescription}`);

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Authentication Failed</title>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: #f5f5f5;
                      }
                      .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        text-align: center;
                      }
                      h1 { color: #de350b; margin: 0 0 1rem 0; }
                      p { color: #666; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>Authentication Failed</h1>
                      <p>${errorDescription || error}</p>
                      <p>You can close this window and try again.</p>
                    </div>
                  </body>
                </html>
              `);

              if (currentFlow) {
                currentFlow.reject(new Error(errorDescription || error));
                currentFlow = null;
              }
            } else if (code && state) {
              logInfo('oauth', 'OAuth callback received successfully');

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Authentication Successful</title>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: #f5f5f5;
                      }
                      .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        text-align: center;
                      }
                      h1 { color: #0052cc; margin: 0 0 1rem 0; }
                      p { color: #666; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>✓ Authentication Successful</h1>
                      <p>You can close this window and return to Atlassify.</p>
                    </div>
                  </body>
                </html>
              `);

              if (currentFlow) {
                currentFlow.resolve({ code, state });
                currentFlow = null;
              }
            } else {
              res.writeHead(400);
              res.end('Missing required parameters');
            }

            // Close server after handling callback
            setTimeout(() => {
              server.close();
              callbackServer = null;
            }, 1000);
          } else {
            res.writeHead(404);
            res.end('Not Found');
          }
        });

        server.listen(port, () => {
          logInfo('oauth', `OAuth callback server listening on port ${port}`);
          resolve(server);
        });

        server.on('error', reject);
      })
      .catch(reject);
  });
}

/**
 * Handle OAuth flow start
 */
export async function handleOAuthFlow(
  request: IOAuthFlowRequest,
): Promise<{ code: string; state: string; codeVerifier: string }> {
  try {
    // Clean up any existing flow
    if (currentFlow) {
      currentFlow.reject(new Error('New OAuth flow started'));
      currentFlow = null;
    }

    if (callbackServer) {
      callbackServer.close();
      callbackServer = null;
    }

    // Extract port from redirectUri
    const redirectUrl = new URL(request.redirectUri);
    const port = Number.parseInt(redirectUrl.port) || DEFAULT_OAUTH_PORT;

    // Start callback server
    callbackServer = await startCallbackServer(port);

    // Generate PKCE parameters
    const codeVerifier = generateRandomString();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString();

    // Build authorization URL
    const authParams = new URLSearchParams({
      client_id: request.clientId,
      response_type: 'code',
      redirect_uri: request.redirectUri,
      scope: request.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      audience: 'api.atlassian.com',
      prompt: 'consent',
    });

    const authUrl = `https://auth.atlassian.com/authorize?${authParams.toString()}`;

    logInfo('oauth', 'Opening authorization URL in browser');

    // Open authorization URL in default browser
    await shell.openExternal(authUrl);

    // Wait for callback
    const result = await new Promise<{ code: string; state: string }>(
      (resolve, reject) => {
        currentFlow = {
          codeVerifier,
          state,
          resolve,
          reject,
        };

        // Timeout after configured duration
        setTimeout(() => {
          if (currentFlow) {
            currentFlow.reject(new Error('OAuth flow timed out'));
            currentFlow = null;
          }
        }, OAUTH_TIMEOUT_MS);
      },
    );

    // Verify state matches
    if (result.state !== state) {
      throw new Error('OAuth state mismatch - possible CSRF attack');
    }

    logInfo('oauth', 'OAuth flow completed successfully');

    return {
      code: result.code,
      state: result.state,
      codeVerifier,
    };
  } catch (error) {
    logError('oauth', 'OAuth flow failed', error);
    throw error;
  } finally {
    currentFlow = null;
    if (callbackServer) {
      callbackServer.close();
      callbackServer = null;
    }
  }
}

/**
 * Register OAuth event handlers
 */
export function registerOAuthHandlers() {
  handleMainEvent(EVENTS.OAUTH_START_FLOW, async (_, data) => {
    const request = data as IOAuthFlowRequest;
    return handleOAuthFlow(request);
  });
}
