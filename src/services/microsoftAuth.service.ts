import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const MICROSOFT_SCOPE = 'openid profile email offline_access';
const MICROSOFT_STATE_PURPOSE = 'microsoft-oauth-state';
const MICROSOFT_STATE_TTL = '10m';
const DEFAULT_FRONTEND_AUTH_CALLBACK_PATH = '/auth/callback';

interface MicrosoftAuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
  frontendUrl: string;
  frontendAuthCallbackPath: string;
  jwtSecret: string;
}

interface MicrosoftStatePayload extends jwt.JwtPayload {
  purpose: string;
  nonce: string;
}

interface MicrosoftTokenResponse {
  id_token?: string;
}

export interface MicrosoftIdTokenClaims extends jwt.JwtPayload {
  aud?: string | string[];
  email?: string;
  iss?: string;
  name?: string;
  oid?: string;
  preferred_username?: string;
  tid?: string;
}

export interface MicrosoftUserProfile {
  azureId: string;
  email: string;
  nombre: string;
}

const getMicrosoftAuthConfig = (): MicrosoftAuthConfig => {
  const {
    AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID,
    AZURE_AD_REDIRECT_URI,
    FRONTEND_URL,
    FRONTEND_AUTH_CALLBACK_PATH,
    JWT_SECRET,
  } = process.env;

  if (!AZURE_AD_CLIENT_ID || !AZURE_AD_CLIENT_SECRET || !AZURE_AD_TENANT_ID || !AZURE_AD_REDIRECT_URI) {
    throw new Error(
      'Microsoft auth is not configured. Set AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID and AZURE_AD_REDIRECT_URI.',
    );
  }

  if (!FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not configured.');
  }

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return {
    clientId: AZURE_AD_CLIENT_ID,
    clientSecret: AZURE_AD_CLIENT_SECRET,
    tenantId: AZURE_AD_TENANT_ID,
    redirectUri: AZURE_AD_REDIRECT_URI,
    frontendUrl: FRONTEND_URL,
    frontendAuthCallbackPath: FRONTEND_AUTH_CALLBACK_PATH ?? DEFAULT_FRONTEND_AUTH_CALLBACK_PATH,
    jwtSecret: JWT_SECRET,
  };
};

const getMicrosoftAuthorizeUrl = (tenantId: string): string =>
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;

const getMicrosoftTokenUrl = (tenantId: string): string =>
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

const getExpectedIssuer = (tenantId: string): string =>
  `https://login.microsoftonline.com/${tenantId}/v2.0`;

const buildFrontendCallbackUrl = (): URL => {
  const { frontendUrl, frontendAuthCallbackPath } = getMicrosoftAuthConfig();
  return new URL(frontendAuthCallbackPath, frontendUrl);
};

const createMicrosoftState = (): string => {
  const { jwtSecret } = getMicrosoftAuthConfig();

  return jwt.sign(
    {
      purpose: MICROSOFT_STATE_PURPOSE,
      nonce: crypto.randomUUID(),
    },
    jwtSecret,
    { expiresIn: MICROSOFT_STATE_TTL },
  );
};

const decodeMicrosoftIdToken = (idToken: string): MicrosoftIdTokenClaims => {
  const decoded = jwt.decode(idToken);

  if (!decoded || typeof decoded === 'string') {
    throw new Error('Microsoft did not return a valid id_token.');
  }

  return decoded as MicrosoftIdTokenClaims;
};

export const buildMicrosoftAuthorizationUrl = (): string => {
  const { clientId, redirectUri, tenantId } = getMicrosoftAuthConfig();
  const state = createMicrosoftState();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_mode: 'query',
    response_type: 'code',
    scope: MICROSOFT_SCOPE,
    state,
  });

  return `${getMicrosoftAuthorizeUrl(tenantId)}?${params.toString()}`;
};

export const validateMicrosoftState = (state: string): void => {
  const { jwtSecret } = getMicrosoftAuthConfig();
  const decoded = jwt.verify(state, jwtSecret) as MicrosoftStatePayload;

  if (decoded.purpose !== MICROSOFT_STATE_PURPOSE || !decoded.nonce) {
    throw new Error('Invalid Microsoft OAuth state.');
  }
};

export const exchangeCodeForMicrosoftUser = async (code: string): Promise<MicrosoftUserProfile> => {
  const config = getMicrosoftAuthConfig();
  const response = await fetch(getMicrosoftTokenUrl(config.tenantId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      scope: MICROSOFT_SCOPE,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Microsoft token exchange failed: ${response.status} ${errorBody}`);
  }

  const tokenData = (await response.json()) as MicrosoftTokenResponse;

  if (!tokenData.id_token) {
    throw new Error('Microsoft token response did not include id_token.');
  }

  const claims = decodeMicrosoftIdToken(tokenData.id_token);
  const audience = Array.isArray(claims.aud) ? claims.aud : claims.aud ? [claims.aud] : [];

  if (!audience.includes(config.clientId)) {
    throw new Error('The Microsoft id_token audience does not match this application.');
  }

  if (claims.tid && claims.tid !== config.tenantId) {
    throw new Error('The Microsoft tenant does not match the configured tenant.');
  }

  if (claims.iss && claims.iss !== getExpectedIssuer(config.tenantId)) {
    throw new Error('The Microsoft id_token issuer is invalid.');
  }

  const email = (claims.preferred_username ?? claims.email ?? '').toLowerCase().trim();
  const nombre = (claims.name ?? email).trim();

  if (!claims.oid || !email || !nombre) {
    throw new Error('Microsoft user claims are incomplete.');
  }

  return {
    azureId: claims.oid,
    email,
    nombre,
  };
};

export const buildFrontendSuccessRedirect = (token: string, empresaDefault: 'beck' | 'firemat'): string => {
  const frontendCallbackUrl = buildFrontendCallbackUrl();
  frontendCallbackUrl.hash = new URLSearchParams({ token, empresaDefault }).toString();
  return frontendCallbackUrl.toString();
};

export const buildFrontendErrorRedirect = (message: string): string => {
  const frontendCallbackUrl = buildFrontendCallbackUrl();
  frontendCallbackUrl.hash = new URLSearchParams({ error: message }).toString();
  return frontendCallbackUrl.toString();
};
