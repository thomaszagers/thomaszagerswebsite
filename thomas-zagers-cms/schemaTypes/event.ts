import { defineField, defineType } from "sanity";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "program",
      title: "Program / subtitle",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: "24-hour format, example 20:00",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return timePattern.test(value.trim())
            ? true
            : "Use 24-hour format like 19:30";
        }),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      initialValue: "Netherlands",
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
    }),
    defineField({
      name: "detailsUrl",
      title: "Details URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
      description: "Only for homepage featured agenda section.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Past", value: "past" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "upcoming",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
      description: "Optional supporting text shown in agenda rows.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      city: "city",
      date: "date",
      status: "status",
      featured: "featured",
    },
    prepare({ title, city, date, status, featured }) {
      const flags = [
        status ? status.charAt(0).toUpperCase() + status.slice(1) : null,
        featured ? "Featured" : null,
      ].filter(Boolean);

      return {
        title,
        subtitle: [date, city, ...flags].filter(Boolean).join(" • "),
      };
    },
  },
});