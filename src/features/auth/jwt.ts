export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

  try {
    const normalized = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getExpiryTime(token: string): number | null {
  const payload = decodeJwt(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

export function isTokenExpired(token: string): boolean {
  const expiry = getExpiryTime(token);
  return expiry === null ? true : Date.now() >= expiry;
}

export function createGuestToken(username: string, ttlMs: number): string {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + ttlMs) / 1000)
  };

  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, "");
  return `${encode(header)}.${encode(payload)}.guest`;
}
