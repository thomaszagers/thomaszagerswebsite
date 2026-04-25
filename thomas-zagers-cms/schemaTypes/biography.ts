import { defineArrayMember, defineField, defineType } from "sanity";

export const biographyType = defineType({
  name: "biography",
  title: "Biography",
  type: "document",
  fields: [
    defineField({
      name: "shortBio",
      title: "Short bio",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "fullBio",
      title: "Full bio",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Biography",
        subtitle: "Bio text and portrait",
      };
    },
  },
});