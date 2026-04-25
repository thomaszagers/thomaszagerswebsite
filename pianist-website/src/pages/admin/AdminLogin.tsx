import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("thomas");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await adminApi.login(username, password);
      navigate("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Thomas Zagers</p>
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}