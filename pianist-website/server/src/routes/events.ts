import { Router } from "express";
import groq from "groq";
import { sanityServerClient } from "../lib/sanityServerClient.js";
import { eventInputSchema } from "../schemas/eventSchema.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

const adminEventsQuery = groq`
  *[_type == "event"] | order(date asc, time asc){
    _id,
    _createdAt,
    _updatedAt,
    title,
    program,
    date,
    time,
    venue,
    city,
    address,
    country,
    ticketUrl,
    detailsUrl,
    featured,
    status,
    notes
  }
`;

const singleEventQuery = groq`
  *[_type == "event" && _id == $id][0]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    program,
    date,
    time,
    venue,
    city,
    address,
    country,
    ticketUrl,
    detailsUrl,
    featured,
    status,
    notes
  }
`;

router.get("/", async (_req, res) => {
  try {
    const events = await sanityServerClient.fetch(adminEventsQuery);
    return res.json(events);
  } catch (error) {
    console.error("Failed to fetch admin events:", error);
    return res.status(500).json({ message: "Failed to fetch events." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await sanityServerClient.fetch(singleEventQuery, {
      id: req.params.id,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return res.status(500).json({ message: "Failed to fetch event." });
  }
});

router.post("/", async (req, res) => {
  const parsed = eventInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const created = await sanityServerClient.create({
      _type: "event",
      ...parsed.data,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Failed to create event:", error);
    return res.status(500).json({ message: "Failed to create event." });
  }
});

router.patch("/:id", async (req, res) => {
  const parsed = eventInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const existing = await sanityServerClient.fetch(
      `*[_type == "event" && _id == $id][0]{ _id }`,
      { id: req.params.id }
    );

    if (!existing) {
      return res.status(404).json({ message: "Event not found." });
    }

    const updated = await sanityServerClient.patch(req.params.id).set(parsed.data).commit();

    return res.json(updated);
  } catch (error) {
    console.error("Failed to update event:", error);
    return res.status(500).json({ message: "Failed to update event." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await sanityServerClient.fetch(
      `*[_type == "event" && _id == $id][0]{ _id }`,
      { id: req.params.id }
    );

    if (!existing) {
      return res.status(404).json({ message: "Event not found." });
    }

    await sanityServerClient.delete(req.params.id);

    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return res.status(500).json({ message: "Failed to delete event." });
  }
});

export default router;