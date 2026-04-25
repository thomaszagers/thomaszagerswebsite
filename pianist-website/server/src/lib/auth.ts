import "dotenv/config";
import bcrypt from "bcryptjs";
import type { Request } from "express";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  throw new Error("Missing admin auth environment variables.");
}

const safeAdminUsername = ADMIN_USERNAME;
const safeAdminPasswordHash = ADMIN_PASSWORD_HASH;

export async function verifyAdminCredentials(username: string, password: string) {
  if (username !== safeAdminUsername) return false;
  return bcrypt.compare(password, safeAdminPasswordHash);
}

export function setAdminSession(req: Request) {
  req.session.isAdmin = true;
  req.session.username = safeAdminUsername;
}