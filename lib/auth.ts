import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "admin_session";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;

const SCRYPT_KEY_LENGTH = 64;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

/** Creates a signed session token containing an expiration timestamp. */
export function createSessionToken(): string {
  const payload = String(Date.now() + SESSION_DURATION_MS);
  return `${payload}.${sign(payload)}`;
}

/** Verifies a session token's signature and expiration. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return false;

  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(sign(payload));
  if (signatureBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}

/** Hashes a password as "salt:hash" using scrypt. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

/** Verifies a password against a "salt:hash" string produced by hashPassword. */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const candidateBuffer = scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  const hashBuffer = Buffer.from(hash, "hex");
  if (candidateBuffer.length !== hashBuffer.length) return false;
  return timingSafeEqual(candidateBuffer, hashBuffer);
}

// Brute-force lockout tracking. In-memory is acceptable here because
// Hostinger runs this app as a persistent Node process, not serverless.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

const failedAttempts = new Map<string, { count: number; lockedUntil: number | null }>();

export function isLockedOut(key: string): boolean {
  const entry = failedAttempts.get(key);
  if (!entry?.lockedUntil) return false;
  if (Date.now() >= entry.lockedUntil) {
    failedAttempts.delete(key);
    return false;
  }
  return true;
}

export function recordFailedAttempt(key: string): void {
  const entry = failedAttempts.get(key) ?? { count: 0, lockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  failedAttempts.set(key, entry);
}

export function clearFailedAttempts(key: string): void {
  failedAttempts.delete(key);
}
