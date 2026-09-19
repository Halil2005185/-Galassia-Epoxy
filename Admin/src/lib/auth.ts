const TOKEN_KEY = "galassia_admin_token";

/**
 * Placeholder auth. The backend has no auth model or /api/auth routes yet,
 * so this only simulates a session locally. Swap the body of `login` for a
 * real API call once that endpoint exists — the function signature/contract
 * (resolve on success, throw on failure) is written to make that a drop-in
 * change for the Login page.
 */
export async function login(email: string, password: string): Promise<void> {
  if (!email.trim() || !password.trim()) {
    throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان.");
  }
  await new Promise((resolve) => setTimeout(resolve, 400));
  localStorage.setItem(TOKEN_KEY, "mock-session-token");
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}