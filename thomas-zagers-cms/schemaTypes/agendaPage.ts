import { defineField, defineType } from "sanity";

export const agendaPageType = defineType({
  name: "agendaPage",
  title: "Agenda Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitleUpcoming",
      title: "Upcoming hero title",
      type: "string",
      initialValue: "Aankomende Optredens",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescriptionUpcoming",
      title: "Upcoming hero description",
      type: "text",
      rows: 3,
      initialValue:
        "Concerten, recitals en samenwerkingen die momenteel gepland staan.",
    }),
    defineField({
      name: "heroTitlePast",
      title: "Past hero title",
      type: "string",
      initialValue: "Eerdere Optredens",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescriptionPast",
      title: "Past hero description",
      type: "text",
      rows: 3,
      initialValue:
        "Een samengesteld archief van eerdere optredens en optredens.",
    }),
    defineField({
      name: "upcomingTabLabel",
      title: "Upcoming tab label",
      type: "string",
      initialValue: "Aankomend",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pastTabLabel",
      title: "Past tab label",
      type: "string",
      initialValue: "Eerder",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cancelledSectionTitle",
      title: "Cancelled section title",
      type: "string",
      initialValue: "Geannuleerde optredens",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "emptyUpcomingText",
      title: "Empty upcoming text",
      type: "string",
      initialValue: "Er zijn momenteel geen aankomende optredens.",
    }),
    defineField({
      name: "emptyPastText",
      title: "Empty past text",
      type: "string",
      initialValue: "Er zijn momenteel geen eerdere optredens.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Agenda Page",
        subtitle: "Agenda hero, tabs, and empty-state content",
      };
    },
  },
});