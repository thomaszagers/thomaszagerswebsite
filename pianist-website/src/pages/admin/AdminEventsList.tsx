import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import type { AdminEvent } from "../../lib/adminTypes";

type FilterKey = "all" | "upcoming" | "past" | "cancelled" | "featured";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time?: string) {
  if (!time) return null;
  return time;
}

function statusClasses(status: AdminEvent["status"]) {
  switch (status) {
    case "upcoming":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "past":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function filterButtonClasses(active: boolean) {
  return active
    ? "bg-slate-900 text-white border-slate-900"
    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50";
}

export default function AdminEventsList() {
  const location = useLocation();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const data = await adminApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this event? This cannot be undone.");
    if (!confirmed) return;

    try {
      await adminApi.deleteEvent(id);
      setEvents((current) => current.filter((event) => event._id !== id));
      setSuccessMessage("Event deleted successfully.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event.");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");

    if (success === "created") {
      setSuccessMessage("Event created successfully.");
    } else if (success === "updated") {
      setSuccessMessage("Event updated successfully.");
    }
  }, [location.search]);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case "upcoming":
        return events.filter((event) => event.status === "upcoming");
      case "past":
        return events.filter((event) => event.status === "past");
      case "cancelled":
        return events.filter((event) => event.status === "cancelled");
      case "featured":
        return events.filter((event) => Boolean(event.featured));
      case "all":
      default:
        return events;
    }
  }, [events, filter]);

  const filterCounts = useMemo(
    () => ({
      all: events.length,
      upcoming: events.filter((event) => event.status === "upcoming").length,
      past: events.filter((event) => event.status === "past").length,
      cancelled: events.filter((event) => event.status === "cancelled").length,
      featured: events.filter((event) => Boolean(event.featured)).length,
    }),
    [events]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">Events</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Manage performances, concerts, collaborations, and featured agenda items.
          </p>
        </div>

        <Link
          to="/admin/events/new"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base text-white transition hover:bg-slate-800"
        >
          + Add Event
        </Link>
      </div>

      {successMessage ? (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="shrink-0 text-green-800 underline underline-offset-4"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${filterButtonClasses(
            filter === "all"
          )}`}
        >
          All ({filterCounts.all})
        </button>

        <button
          type="button"
          onClick={() => setFilter("upcoming")}
          className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${filterButtonClasses(
            filter === "upcoming"
          )}`}
        >
          Upcoming ({filterCounts.upcoming})
        </button>

        <button
          type="button"
          onClick={() => setFilter("past")}
          className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${filterButtonClasses(
            filter === "past"
          )}`}
        >
          Past ({filterCounts.past})
        </button>

        <button
          type="button"
          onClick={() => setFilter("cancelled")}
          className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${filterButtonClasses(
            filter === "cancelled"
          )}`}
        >
          Cancelled ({filterCounts.cancelled})
        </button>

        <button
          type="button"
          onClick={() => setFilter("featured")}
          className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${filterButtonClasses(
            filter === "featured"
          )}`}
        >
          Featured ({filterCounts.featured})
        </button>
      </div>

      {loading ? <p className="text-slate-600">Loading events...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 md:hidden">
            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                    {event.program ? (
                      <p className="mt-1 text-sm text-slate-500">{event.program}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClasses(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>

                    {event.featured ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Date:</span> {formatDate(event.date)}
                    {formatTime(event.time) ? ` · ${formatTime(event.time)}` : ""}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Venue:</span> {event.venue}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">City:</span> {event.city}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    to={`/admin/events/${event._id}/edit`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(event._id)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {filteredEvents.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                No events found for this filter.
              </div>
            ) : null}
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-medium">Title</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Venue</th>
                    <th className="px-5 py-4 font-medium">City</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Featured</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-medium text-slate-900">{event.title}</td>
                      <td className="px-5 py-4">
                        {formatDate(event.date)}
                        {formatTime(event.time) ? (
                          <div className="mt-1 text-xs text-slate-500">{formatTime(event.time)}</div>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">{event.venue}</td>
                      <td className="px-5 py-4">{event.city}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClasses(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">{event.featured ? "Yes" : "No"}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-4">
                          <Link
                            to={`/admin/events/${event._id}/edit`}
                            className="text-slate-900 underline underline-offset-4"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(event._id)}
                            className="text-red-600 underline underline-offset-4"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        No events found for this filter.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}