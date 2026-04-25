import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Example: big-band, theatre-production, ensemble",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Example: Pianist, Arrangeur, Muzikaal leider",
    }),
    defineField({
      name: "logo",
      title: "Decorative logo / sticker",
      type: "image",
      options: { hotspot: true },
      description:
        "Small decorative logo used as accent in the projecten area and modal.",
    }),
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      description:
        "Used on homepage project card and in the large modal visual.",
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      rows: 6,
      description: "Shown in the project modal detail panel.",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
      description: "Only used for homepage featured projects.",
    }),
    defineField({
      name: "isCurrent",
      title: "Currently active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "projectUrl",
      title: "Project URL",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower number appears first.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title,
        subtitle: [subtitle, featured ? "Featured" : null]
          .filter(Boolean)
          .join(" • "),
        media,
      };
    },
  },
});