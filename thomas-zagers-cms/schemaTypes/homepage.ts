import { defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      initialValue: "Thomas Zagers",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTypedLine",
      title: "Hero typed line",
      type: "string",
      description:
        "Example: Pianist - Begeleider/Muzikaal leider - Componist/Arrangeur",
    }),

    defineField({
      name: "heroImage",
      title: "Hero background image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "heroSecondaryCtaLabel",
      title: "Secondary CTA label",
      type: "string",
      initialValue: "Lees meer",
    }),
    defineField({
      name: "biographyTeaser",
      title: "Biography teaser",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: "heroTitle",
      subtitle: "heroTypedLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Homepage",
        subtitle: subtitle || "Homepage content",
      };
    },
  },
});