interface TokenCache {
  token: string;
  expiresAt: number;
}

let cachedToken: TokenCache | null = null;

const IAM_URL = "https://iam.cloud.ibm.com/identity/token";
const TOKEN_TTL_MS = 55 * 60 * 1000;

export async function getIamToken(apiKey: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await fetch(IAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(apiKey)}`,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`IAM token exchange failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const token = data.access_token as string;

  cachedToken = { token, expiresAt: Date.now() + TOKEN_TTL_MS };
  return token;
}
