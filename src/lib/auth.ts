import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";

export function getAdminSessionToken() {
  const token = process.env.ADMIN_SESSION_TOKEN;
  if (!token) throw new Error("Missing ADMIN_SESSION_TOKEN");
  return token;
}

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Missing ADMIN_PASSWORD");
  return password;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === getAdminSessionToken();
}

export async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }
}
