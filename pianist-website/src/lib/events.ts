import type { EventData } from "./types"

export type DerivedEventStatus = "upcoming" | "past" | "cancelled"

export type GroupedEvents = {
  monthKey: string
  monthLabel: string
  events: EventData[]
}

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/

export function getEventDateTime(date: string, time?: string) {
  const safeTime =
    time && timePattern.test(time.trim()) ? `${time.trim()}:00` : "23:59:00"

  return new Date(`${date}T${safeTime}`)
}

export function getDerivedEventStatus(
  event: Pick<EventData, "date" | "time" | "status">
): DerivedEventStatus {
  if (event.status === "cancelled") return "cancelled"
  if (event.status === "past") return "past"

  return getEventDateTime(event.date, event.time).getTime() < Date.now()
    ? "past"
    : "upcoming"
}

export function sortEventsAscending(events: EventData[]) {
  return [...events].sort(
    (a, b) =>
      getEventDateTime(a.date, a.time).getTime() -
      getEventDateTime(b.date, b.time).getTime()
  )
}

export function sortEventsDescending(events: EventData[]) {
  return [...events].sort(
    (a, b) =>
      getEventDateTime(b.date, b.time).getTime() -
      getEventDateTime(a.date, a.time).getTime()
  )
}

export function formatEventDay(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
  })
}

export function formatEventMonthShort(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "short",
  })
}

export function formatEventMonthLong(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })
}

export function getEventMetaLine(event: Pick<EventData, "venue" | "city" | "time">) {
  return [event.venue, event.city, event.time].filter(Boolean).join(" | ")
}

export function groupEventsByMonth(
  events: EventData[],
  direction: "asc" | "desc" = "asc"
): GroupedEvents[] {
  const sorted =
    direction === "asc" ? sortEventsAscending(events) : sortEventsDescending(events)

  const grouped = new Map<string, GroupedEvents>()

  for (const event of sorted) {
    const date = new Date(`${event.date}T00:00:00`)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`
    const monthLabel = formatEventMonthLong(event.date)

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, {
        monthKey,
        monthLabel,
        events: [],
      })
    }

    grouped.get(monthKey)?.events.push(event)
  }

  return Array.from(grouped.values())
}