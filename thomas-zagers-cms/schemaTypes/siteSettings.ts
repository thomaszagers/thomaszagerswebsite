import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      initialValue: "Thomas Zagers",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactHeading",
      title: "Contact heading",
      type: "string",
      initialValue: "Contact",
    }),
    defineField({
      name: "contactIntro",
      title: "Contact intro",
      type: "text",
      rows: 3,
      initialValue: "Stuur een mail naar",
    }),
    defineField({
      name: "contactButtonLabel",
      title: "Contact button label",
      type: "string",
      initialValue: "Neem contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (Rule) =>
        Rule.required().email().error("Enter a valid email address."),
    }),
    defineField({
      name: "contactBackgroundImage",
      title: "Contact background image",
      type: "image",
      options: { hotspot: true },
      description: "Used behind the contact section on the homepage.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Spotify", value: "spotify" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Website", value: "website" },
                  { title: "Mail", value: "mail" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
            prepare({ title, subtitle }) {
              return {
                title: title
                  ? title.charAt(0).toUpperCase() + title.slice(1)
                  : "Social link",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      initialValue: "Thomas Zagers Music",
    }),
    defineField({
      name: "kvkNumber",
      title: "KVK number",
      type: "string",
    }),
    defineField({
      name: "vatNumber",
      title: "VAT / BTW number",
      type: "string",
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright text",
      type: "string",
      initialValue: `Copyright © ${new Date().getFullYear()} Thomas Zagers`,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Footer, contact, socials, business info",
      };
    },
  },
});