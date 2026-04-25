export type AdminUser = {
  username: string;
};

export type AdminAuthResponse = {
  authenticated: boolean;
  user?: AdminUser;
};

export type AdminEvent = {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string;
  program?: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  address?: string;
  country?: string;
  ticketUrl?: string;
  detailsUrl?: string;
  featured?: boolean;
  status: "upcoming" | "past" | "cancelled";
  notes?: string;
};

export type AdminEventInput = {
  title: string;
  program?: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  address?: string;
  country?: string;
  ticketUrl?: string;
  detailsUrl?: string;
  featured: boolean;
  status: "upcoming" | "past" | "cancelled";
  notes?: string;
};