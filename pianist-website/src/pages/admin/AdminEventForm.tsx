import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import type { AdminEventInput } from "../../lib/adminTypes";

type FormErrors = Partial<Record<keyof AdminEventInput, string>>;

const emptyForm: AdminEventInput = {
  title: "",
  program: "",
  date: "",
  time: "",
  venue: "",
  city: "",
  address: "",
  country: "Netherlands",
  ticketUrl: "",
  detailsUrl: "",
  featured: false,
  status: "upcoming",
  notes: "",
};

function isValidHttpUrl(value?: string) {
  if (!value) return true;
  return /^https?:\/\/.+/i.test(value);
}

function validateForm(form: AdminEventInput): FormErrors {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!form.date.trim()) {
    errors.date = "Date is required.";
  }

  if (!form.venue.trim()) {
    errors.venue = "Venue is required.";
  }

  if (!form.city.trim()) {
    errors.city = "City is required.";
  }

  if (form.ticketUrl && !isValidHttpUrl(form.ticketUrl)) {
    errors.ticketUrl = "Ticket URL must start with http:// or https://";
  }

  if (form.detailsUrl && !isValidHttpUrl(form.detailsUrl)) {
    errors.detailsUrl = "Details URL must start with http:// or https://";
  }

  return errors;
}

export default function AdminEventForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const [form, setForm] = useState<AdminEventInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode || !id) return;

    adminApi
      .getEventById(id)
      .then((event) => {
        setForm({
          title: event.title ?? "",
          program: event.program ?? "",
          date: event.date ?? "",
          time: event.time ?? "",
          venue: event.venue ?? "",
          city: event.city ?? "",
          address: event.address ?? "",
          country: event.country ?? "Netherlands",
          ticketUrl: event.ticketUrl ?? "",
          detailsUrl: event.detailsUrl ?? "",
          featured: Boolean(event.featured),
          status: event.status,
          notes: event.notes ?? "",
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load event.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isEditMode]);

  function updateField<K extends keyof AdminEventInput>(key: K, value: AdminEventInput[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && id) {
        await adminApi.updateEvent(id, form);
        navigate("/admin/events?success=updated");
      } else {
        await adminApi.createEvent(form);
        navigate("/admin/events?success=created");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-slate-600">Loading event...</p>;
  }

  return (
    <section className="space-y-6 pb-28 md:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin / Events</p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            {isEditMode ? "Edit Event" : "Add Event"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Fill in the concert details as they should appear on the website agenda.
          </p>
        </div>

        <Link
          to="/admin/events"
          className="text-sm font-medium text-slate-600 underline underline-offset-4"
        >
          Back to events
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <SectionCard title="Basic Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title *" error={errors.title}>
              <input
                className={inputClassName(errors.title)}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Solo Recital Thomas Zagers"
                autoFocus={!isEditMode}
              />
            </Field>

            <Field label="Program / Subtitle" error={errors.program}>
              <input
                className={inputClassName(errors.program)}
                value={form.program ?? ""}
                onChange={(e) => updateField("program", e.target.value)}
                placeholder="Bach, Debussy, Ravel"
              />
            </Field>

            <Field label="Date *" error={errors.date}>
              <input
                type="date"
                className={inputClassName(errors.date)}
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </Field>

            <Field label="Time" error={errors.time}>
              <input
                type="time"
                className={inputClassName(errors.time)}
                value={form.time ?? ""}
                onChange={(e) => updateField("time", e.target.value)}
              />
            </Field>

            <Field label="Venue *" error={errors.venue}>
              <input
                className={inputClassName(errors.venue)}
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                placeholder="Concertgebouw"
              />
            </Field>

            <Field label="City *" error={errors.city}>
              <input
                className={inputClassName(errors.city)}
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Amsterdam"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Location">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Address" error={errors.address}>
              <input
                className={inputClassName(errors.address)}
                value={form.address ?? ""}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Museumplein 10"
              />
            </Field>

            <Field label="Country" error={errors.country}>
              <input
                className={inputClassName(errors.country)}
                value={form.country ?? ""}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Netherlands"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Links">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ticket URL" error={errors.ticketUrl}>
              <input
                className={inputClassName(errors.ticketUrl)}
                value={form.ticketUrl ?? ""}
                onChange={(e) => updateField("ticketUrl", e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <Field label="Details URL" error={errors.detailsUrl}>
              <input
                className={inputClassName(errors.detailsUrl)}
                value={form.detailsUrl ?? ""}
                onChange={(e) => updateField("detailsUrl", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Publishing">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Status *" error={errors.status}>
              <select
                className={inputClassName(errors.status)}
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as AdminEventInput["status"])
                }
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <div className="flex items-end">
              <label className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-800">Featured event</span>
              </label>
            </div>
          </div>

          <Field label="Notes" error={errors.notes}>
            <textarea
              className={inputClassName(errors.notes)}
              value={form.notes ?? ""}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Optional extra notes for the event"
            />
          </Field>
        </SectionCard>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="hidden gap-3 md:flex">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
          </button>

          <Link
            to="/admin/events"
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-800 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex gap-3">
            <Link
              to="/admin/events"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-slate-300 px-4 py-3 text-sm font-medium text-slate-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function inputClassName(hasError?: string) {
  return hasError ? "input input-error" : "input";
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}