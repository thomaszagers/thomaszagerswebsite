import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === "" ? undefined : value))
  .refine((value) => !value || /^https?:\/\/.+/i.test(value), {
    message: "Must be a valid URL starting with http:// or https://",
  });

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

export const eventInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  program: optionalString,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: optionalString,
  venue: z.string().trim().min(1, "Venue is required"),
  city: z.string().trim().min(1, "City is required"),
  address: optionalString,
  country: optionalString,
  ticketUrl: optionalUrl,
  detailsUrl: optionalUrl,
  featured: z.boolean().optional().default(false),
  status: z.enum(["upcoming", "past", "cancelled"]),
  notes: optionalString,
});

export type EventInput = z.infer<typeof eventInputSchema>;