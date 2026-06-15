import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-admin-secrets.mjs <admin-password>");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const sessionSecret = randomBytes(32).toString("hex");

console.log("Add these to .env.local (and later to hPanel Environment Variables):\n");
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);
console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
