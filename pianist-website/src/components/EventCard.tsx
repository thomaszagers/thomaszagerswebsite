import type { EventData } from "../lib/types"
import {
  formatEventDay,
  formatEventMonthShort,
  getDerivedEventStatus,
  getEventMetaLine,
} from "../lib/events"

type EventCardProps = {
  event: EventData
  subtle?: boolean
}

export default function EventCard({ event, subtle = false }: EventCardProps) {
  const derivedStatus = getDerivedEventStatus(event)
  const isCancelled = derivedStatus === "cancelled"
  const isPast = derivedStatus === "past"

  const rootClasses = [
    "rounded-[1.75rem] border p-5 transition-all duration-300 sm:p-6",
    subtle
      ? "border-[var(--border)] bg-white/65"
      : "border-[var(--border)] bg-white/88 shadow-[0_10px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(36,61,120,0.08)]",
    isCancelled ? "opacity-75" : "",
  ].join(" ")

  return (
    <article className={rootClasses}>
      <div className="flex items-start gap-4 sm:gap-6">
        <div
          className={[
            "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-[0_12px_26px_rgba(36,61,120,0.18)] sm:h-20 sm:w-20",
            isCancelled ? "bg-[var(--muted-foreground)]" : "bg-[var(--accent)]",
          ].join(" ")}
        >
          <span className="text-2xl font-semibold leading-none sm:text-3xl">
            {formatEventDay(event.date)}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs">
            {formatEventMonthShort(event.date)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {event.title}
            </h3>

            {isCancelled ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                Cancelled
              </span>
            ) : event.featured && !isPast ? (
              <span className="rounded-full border border-[var(--accent)]/15 bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                Featured
              </span>
            ) : null}
          </div>

          {event.program ? (
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {event.program}
            </p>
          ) : null}

          <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
            {getEventMetaLine(event)}
          </p>

          {event.notes ? (
            <p className="mt-3 text-[15px] leading-7 text-[var(--muted-foreground)]">
              {event.notes}
            </p>
          ) : null}

          {(event.ticketUrl || event.detailsUrl) && !isCancelled ? (
            <div className="flex flex-wrap gap-5 pt-4">
              {event.ticketUrl ? (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  Tickets →
                </a>
              ) : null}

              {event.detailsUrl ? (
                <a
                  href={event.detailsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  Details →
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}