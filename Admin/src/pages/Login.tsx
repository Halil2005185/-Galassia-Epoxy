import { useState } from "react";
import { login } from "../lib/auth";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-5">
      <div className="w-full max-w-sm border border-border bg-surface p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center border border-ink text-lg font-display">
            G
          </span>
          <p className="label-caps mt-4 text-brass">أتيليه الإدارة</p>
          <h1 className="mt-2 font-display text-2xl">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-graphite">
            قم بإدارة كتالوج غالاسيا للإيبوكسي.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-caps text-graphite" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-2"
              placeholder="you@galassia.design"
              dir="ltr"
            />
          </div>
          <div>
            <label className="label-caps text-graphite" htmlFor="password">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-2"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          {error && (
            <p className="border border-border bg-canvas px-3 py-2 text-sm text-ink">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary label-caps w-full">
            {loading ? "جاري تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
