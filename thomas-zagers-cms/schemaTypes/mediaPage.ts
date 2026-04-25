import { defineField, defineType } from "sanity";

export const mediaPageType = defineType({
  name: "mediaPage",
  title: "Media Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      initialValue: "Media Archive",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      rows: 3,
      initialValue:
        "A compact collection of recordings, videos, photos, and embedded media.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. If empty, frontend falls back to a featured media preview.",
    }),
    defineField({
      name: "emptyText",
      title: "Empty state text",
      type: "string",
      initialValue: "No media available for this filter yet.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Media Page",
        subtitle: "Media archive hero content",
      };
    },
  },
});