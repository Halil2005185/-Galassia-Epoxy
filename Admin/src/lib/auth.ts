import * as authApi from "../api/auth";
import { setAccessToken } from "../api/client";

export async function login(email: string, password: string): Promise<void> {
  const { accessToken } = await authApi.login(email, password);
  setAccessToken(accessToken);
}

export async function logout(): Promise<void> {
  setAccessToken(null);
  await authApi.logout().catch(() => {
    // Cookie clearing already happened server-side if this fails for any
    // reason other than "already logged out" — nothing more to do locally.
  });
}

/**
 * Called once on app load. The refresh token lives in an HttpOnly cookie,
 * so a valid session survives a page reload — this silently exchanges it
 * for a fresh access token instead of asking for the password again.
 */
export async function restoreSession(): Promise<boolean> {
  try {
    const { accessToken } = await authApi.refresh();
    setAccessToken(accessToken);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}
