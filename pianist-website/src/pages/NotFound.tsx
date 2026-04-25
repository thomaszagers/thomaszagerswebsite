import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Home, Mail, Music2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-black/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-52 w-52 rounded-full bg-black/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-white/60 shadow-sm backdrop-blur">
            <Music2 size={28} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
            404 — Pagina niet gevonden
          </p>

          <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Deze pagina klinkt niet helemaal goed.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            De pagina die je zoekt bestaat niet, is verplaatst of is tijdelijk
            niet beschikbaar.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="group inline-flex min-w-[238px] items-center justify-center gap-2 rounded-full bg-[#16171a] px-6 py-3 text-sm font-semibold !text-[#f8f6f2] shadow-lg shadow-black/10 transition hover:scale-[1.02] hover:bg-black hover:shadow-xl"
            >
              <Home size={17} className="shrink-0 !text-[#f8f6f2]" />
              <span className="!text-[#f8f6f2]">Terug naar home</span>
            </Link>

            <Link
              to="/agenda"
              className="inline-flex min-w-[210px] items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/60 px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white hover:shadow-sm"
            >
              <CalendarDays size={17} className="shrink-0" />
              Bekijk agenda
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-[var(--muted-foreground)] sm:flex-row">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 transition hover:text-[var(--foreground)]"
            >
              <ArrowLeft size={15} />
              Ga terug
            </button>

            <span className="hidden h-1 w-1 rounded-full bg-[var(--muted-foreground)] sm:block" />

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 transition hover:text-[var(--foreground)]"
            >
              <Mail size={15} />
              Contact opnemen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
