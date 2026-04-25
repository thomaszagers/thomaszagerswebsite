import { Link, Outlet, useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await adminApi.logout();
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Thomas Zagers</p>
            <h1 className="text-xl font-semibold">Admin</h1>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="hover:text-[var(--accent)]">
              Dashboard
            </Link>
            <Link to="/admin/events" className="hover:text-[var(--accent)]">
              Events
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}