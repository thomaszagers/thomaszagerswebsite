import { defineField, defineType } from "sanity";

export const mediaItemType = defineType({
  name: "mediaItem",
  title: "Media Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "Audio / Recording", value: "audio" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      description:
        "Required for image items. Optional for video/audio when you want a dedicated main image.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context.document as { type?: string } | undefined)?.type;

          if (mediaType === "image" && !value) {
            return "A main image is required for image items.";
          }

          return true;
        }),
    }),
    defineField({
      name: "previewImage",
      title: "Preview / poster image",
      type: "image",
      options: { hotspot: true },
      description:
        "Recommended for video and audio. Used for gallery tiles and hero fallback.",
    }),
    defineField({
      name: "embedUrl",
      title: "Embed / external URL",
      type: "url",
      description: "YouTube, Vimeo, Spotify, SoundCloud, etc.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context.document as { type?: string } | undefined)?.type;

          if ((mediaType === "video" || mediaType === "audio") && !value) {
            return "An external media URL is required for video and audio items.";
          }

          return true;
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
      description: "Used for homepage featured media and hero fallback priority.",
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
      title: "title",
      type: "type",
      featured: "featured",
      image: "image",
      previewImage: "previewImage",
    },
    prepare({ title, type, featured, image, previewImage }) {
      return {
        title,
        subtitle: [type, featured ? "Featured" : null]
          .filter(Boolean)
          .join(" • "),
        media: image || previewImage,
      };
    },
  },
});