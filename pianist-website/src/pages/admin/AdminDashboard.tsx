import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
        <h2 className="text-3xl font-semibold">Content Management</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/admin/events"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-xl font-semibold">Events / Agenda</h3>
          <p className="mt-2 text-slate-600">
            Create, edit, and remove performances shown on the agenda page.
          </p>
        </Link>
      </div>
    </section>
  );
}