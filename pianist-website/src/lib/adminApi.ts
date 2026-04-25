import type { AdminAuthResponse, AdminEvent, AdminEventInput } from "./adminTypes";

async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

export const adminApi = {
  login: (username: string, password: string) =>
    apiFetch<{ user: { username: string } }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    apiFetch<{ success: true }>("/api/admin/logout", {
      method: "POST",
    }),

  me: () => apiFetch<AdminAuthResponse>("/api/admin/me"),

  getEvents: () => apiFetch<AdminEvent[]>("/api/admin/events"),

  getEventById: (id: string) => apiFetch<AdminEvent>(`/api/admin/events/${id}`),

  createEvent: (payload: AdminEventInput) =>
    apiFetch<AdminEvent>("/api/admin/events", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateEvent: (id: string, payload: AdminEventInput) =>
    apiFetch<AdminEvent>(`/api/admin/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteEvent: (id: string) =>
    apiFetch<{ success: true }>(`/api/admin/events/${id}`, {
      method: "DELETE",
    }),
};