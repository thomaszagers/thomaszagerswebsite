import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import heroPhoto from "../assets/ThomasHero.jpg";
import { sanityClient, urlFor } from "../lib/sanity";
import { agendaPageQuery, eventsQuery } from "../lib/queries";
import type { AgendaPageData, EventData } from "../lib/types";

type AgendaTab = "upcoming" | "past";

type GroupedEvents = {
  monthKey: string;
  monthLabel: string;
  events: EventData[];
};

function getEventDateTime(date: string, time?: string) {
  const safeTime = time?.trim() ? `${time.trim()}:00` : "23:59:00";
  return new Date(`${date}T${safeTime}`);
}

function getDerivedEventStatus(
  event: Pick<EventData, "date" | "time" | "status">,
) {
  if (event.status === "cancelled") return "cancelled";
  if (event.status === "past") return "past";

  return getEventDateTime(event.date, event.time).getTime() < Date.now()
    ? "past"
    : "upcoming";
}

function formatMonthLabel(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("nl-NL", {
    month: "long",
    year: "numeric",
  });
}

function formatDay(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
  });
}

function formatMonthShort(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
    month: "short",
  });
}

function sortEvents(events: EventData[], direction: "asc" | "desc") {
  return [...events].sort((a, b) => {
    const diff =
      getEventDateTime(a.date, a.time).getTime() -
      getEventDateTime(b.date, b.time).getTime();

    return direction === "asc" ? diff : -diff;
  });
}

function groupEventsByMonth(
  events: EventData[],
  direction: "asc" | "desc",
): GroupedEvents[] {
  const sorted = sortEvents(events, direction);
  const groups = new Map<string, GroupedEvents>();

  for (const event of sorted) {
    const date = new Date(`${event.date}T00:00:00`);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    if (!groups.has(monthKey)) {
      groups.set(monthKey, {
        monthKey,
        monthLabel: formatMonthLabel(event.date),
        events: [],
      });
    }

    groups.get(monthKey)?.events.push(event);
  }

  return Array.from(groups.values());
}

function AgendaTabs({
  activeTab,
  onChange,
  upcomingLabel,
  pastLabel,
}: {
  activeTab: AgendaTab;
  onChange: (tab: AgendaTab) => void;
  upcomingLabel: string;
  pastLabel: string;
}) {
  const tabs = [
    { key: "upcoming" as const, label: upcomingLabel },
    { key: "past" as const, label: pastLabel },
  ];

  return (
    <div className="border-b border-[var(--border)]">
      <div className="flex items-center gap-8 sm:gap-12">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={[
                "group relative pb-4 text-left text-[1.05rem] font-medium tracking-[-0.01em] transition-all duration-250 sm:text-[1.2rem]",
                isActive
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              <span className="transition-transform duration-250 group-hover:translate-y-[-1px]">
                {tab.label}
              </span>

              <span
                className={[
                  "absolute inset-x-0 -bottom-px h-[2px] origin-left rounded-full bg-[var(--foreground)] transition-transform duration-300",
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100/80",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgendaListRow({ event }: { event: EventData }) {
  const derivedStatus = getDerivedEventStatus(event);
  const isCancelled = derivedStatus === "cancelled";

  return (
    <article
      className={[
        "grid gap-4 px-5 py-5 transition-colors duration-200 md:grid-cols-[88px_1fr_auto] md:items-center md:gap-6 md:px-7 md:py-6",
        isCancelled ? "opacity-75" : "hover:bg-[var(--accent-soft-2)]/45",
      ].join(" ")}
    >
      <div className="flex items-center gap-4 md:block">
        <div
          className={[
            "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[1.2rem] border text-center md:h-[84px] md:w-[84px]",
            isCancelled
              ? "border-[var(--border)] bg-[var(--panel)] text-[var(--muted-foreground)]"
              : "border-[var(--accent)]/10 bg-[var(--accent-soft)] text-[var(--accent)]",
          ].join(" ")}
        >
          <span className="text-2xl font-semibold leading-none md:text-3xl">
            {formatDay(event.date)}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] md:text-[11px]">
            {formatMonthShort(event.date)}
          </span>
        </div>

        {isCancelled ? (
          <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] md:hidden">
            Cancelled
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
            {event.title}
          </h3>

          {isCancelled ? (
            <span className="hidden rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] md:inline-flex">
              Cancelled
            </span>
          ) : null}
        </div>

        {event.program ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:text-sm">
            {event.program}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted-foreground)] sm:text-[15px]">
          {event.venue || event.city ? (
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} />
              {[event.venue, event.city].filter(Boolean).join(", ")}
            </span>
          ) : null}

          {event.time ? (
            <span className="inline-flex items-center gap-2">
              <Clock3 size={15} />
              {event.time}
            </span>
          ) : null}

          {event.notes ? (
            <span className="text-[var(--muted-foreground)]">{event.notes}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end">
        {event.ticketUrl && !isCancelled ? (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/16 bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
          >
            Tickets
            <ArrowUpRight size={14} />
          </a>
        ) : null}

        {event.detailsUrl && !isCancelled ? (
          <a
            href={event.detailsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            Details
            <ArrowUpRight size={14} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function MonthSection({
  label,
  events,
}: {
  label: string;
  events: EventData[];
}) {
  return (
    <section className="space-y-6 sm:space-y-7">
      <div className="flex items-center gap-4">
        <div className="h-[2px] w-12 bg-[var(--accent)]/35" />
        <h2 className="editorial-title text-4xl font-semibold leading-none text-[var(--foreground)] sm:text-5xl md:text-6xl">
          {label}
        </h2>
      </div>

      <div className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
        {events.map((event, index) => (
          <div key={event._id}>
            <AgendaListRow event={event} />
            {index < events.length - 1 ? (
              <div className="mx-5 border-t border-[var(--border)]/75 md:mx-7" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Agenda() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [agendaPage, setAgendaPage] = useState<AgendaPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AgendaTab>("upcoming");

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<EventData[]>(eventsQuery),
      sanityClient.fetch<AgendaPageData>(agendaPageQuery),
    ])
      .then(([eventsData, agendaPageData]) => {
        setEvents(eventsData || []);
        setAgendaPage(agendaPageData || null);
      })
      .catch((error) => console.error("Failed to fetch agenda content:", error))
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = useMemo(
    () =>
      sortEvents(
        events.filter((event) => getDerivedEventStatus(event) === "upcoming"),
        "asc",
      ),
    [events],
  );

  const pastEvents = useMemo(
    () =>
      sortEvents(
        events.filter((event) => getDerivedEventStatus(event) === "past"),
        "desc",
      ),
    [events],
  );

  const cancelledEvents = useMemo(
    () =>
      sortEvents(
        events.filter((event) => getDerivedEventStatus(event) === "cancelled"),
        "asc",
      ),
    [events],
  );

  const groupedUpcoming = useMemo(
    () => groupEventsByMonth(upcomingEvents, "asc"),
    [upcomingEvents],
  );

  const groupedPast = useMemo(
    () => groupEventsByMonth(pastEvents, "desc"),
    [pastEvents],
  );

  const displayedGroups = activeTab === "upcoming" ? groupedUpcoming : groupedPast;

  const heroTitle =
    activeTab === "upcoming"
      ? agendaPage?.heroTitleUpcoming || "Aankomende Optredens"
      : agendaPage?.heroTitlePast || "Eerdere Optredens";

  const heroDescription =
    activeTab === "upcoming"
      ? agendaPage?.heroDescriptionUpcoming ||
        "Concerten, recitals en samenwerkingen die momenteel gepland staan."
      : agendaPage?.heroDescriptionPast ||
        "Een samengesteld archief van eerdere optredens en optredens.";

  const emptyText =
    activeTab === "upcoming"
      ? agendaPage?.emptyUpcomingText ||
        "Er zijn momenteel geen aankomende optredens."
      : agendaPage?.emptyPastText ||
        "Er zijn momenteel geen eerdere optredens.";

  const heroImageUrl =
    agendaPage?.heroImage
      ? urlFor(agendaPage.heroImage).width(2200).height(1300).fit("crop").url()
      : heroPhoto;

  const upcomingTabLabel = agendaPage?.upcomingTabLabel || "Aankomend";
  const pastTabLabel = agendaPage?.pastTabLabel || "Eerder";
  const cancelledSectionTitle =
    agendaPage?.cancelledSectionTitle || "Geannuleerde optredens";

  return (
    <div className="bg-[var(--background)]">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,10,17,0.60)_0%,rgba(7,10,17,0.42)_36%,rgba(7,10,17,0.24)_60%,rgba(7,10,17,0.16)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,10,17,0.30)_0%,rgba(7,10,17,0.12)_45%,rgba(7,10,17,0.12)_100%)]" />
        </div>

        <div className="relative z-10">
          <div className="container-shell flex min-h-[38vh] items-end py-16 sm:min-h-[42vh] sm:py-20 lg:min-h-[46vh] lg:py-24">
            <div className="max-w-4xl pt-16 sm:pt-20">
              <h1 className="editorial-title text-6xl font-semibold leading-[0.92] text-white sm:text-7xl md:text-8xl xl:text-[7rem]">
                {heroTitle}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/84 sm:text-lg sm:leading-8 lg:text-[1.2rem]">
                {heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-10 sm:pb-24 sm:pt-12">
        <div className="container-shell space-y-8 sm:space-y-10">
          <AgendaTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            upcomingLabel={upcomingTabLabel}
            pastLabel={pastTabLabel}
          />

          {loading ? (
            <div className="rounded-[1.7rem] border border-[var(--border)] bg-white px-6 py-8 text-[var(--muted-foreground)]">
              Loading events...
            </div>
          ) : displayedGroups.length === 0 ? (
            <div className="rounded-[1.7rem] border border-[var(--border)] bg-white px-6 py-8 text-[var(--muted-foreground)]">
              {emptyText}
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-12">
              {displayedGroups.map((group) => (
                <MonthSection
                  key={group.monthKey}
                  label={group.monthLabel}
                  events={group.events}
                />
              ))}
            </div>
          )}

          {!loading &&
          activeTab === "upcoming" &&
          cancelledEvents.length > 0 ? (
            <section className="space-y-5 rounded-[1.7rem] border border-dashed border-[var(--border)] bg-white p-5 sm:p-7">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {cancelledSectionTitle}
                </h2>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--panel)]">
                {cancelledEvents.map((event, index) => (
                  <div key={event._id}>
                    <AgendaListRow event={event} />
                    {index < cancelledEvents.length - 1 ? (
                      <div className="mx-5 border-t border-[var(--border)]/75 md:mx-7" />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}