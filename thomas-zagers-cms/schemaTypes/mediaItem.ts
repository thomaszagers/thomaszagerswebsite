import {defineField, defineType} from 'sanity'

export const mediaItemType = defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
          {title: 'Audio / Recording', value: 'audio'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Required for image items. Optional for video/audio when you want a dedicated main image.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context.document as {type?: string} | undefined)?.type

          if (mediaType === 'image' && !value) {
            return 'A main image is required for image items.'
          }

          return true
        }),
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview / poster image',
      type: 'image',
      options: {hotspot: true},
      description: 'Recommended for video and audio. Used for gallery tiles and hero fallback.',
    }),
    defineField({
      name: 'embedUrl',
      title: 'Embed / external URL',
      type: 'url',
      description: 'YouTube, Vimeo, Spotify, SoundCloud, etc.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context.document as {type?: string} | undefined)?.type

          if ((mediaType === 'video' || mediaType === 'audio') && !value) {
            return 'An external media URL is required for video and audio items.'
          }

          return true
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on to show this media item in the homepage media section.',
    }),

    defineField({
      name: 'homepageOrder',
      title: 'Homepage featured order',
      type: 'number',
      description:
        "Only used when 'Featured on homepage' is enabled. Lower number appears first on the homepage.",
      hidden: ({document}) => !document?.featured,
      validation: (Rule) => Rule.integer().min(0),
    }),

    defineField({
      name: 'order',
      title: 'Media page order',
      type: 'number',
      description: 'Controls the order on the full Media page. Lower number appears first.',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      featured: 'featured',
      homepageOrder: 'homepageOrder',
      order: 'order',
      image: 'image',
      previewImage: 'previewImage',
    },
    prepare({title, type, featured, homepageOrder, order, image, previewImage}) {
      return {
        title,
        subtitle: [
          type,
          featured ? 'Featured' : null,
          featured && homepageOrder !== undefined ? `Home order: ${homepageOrder}` : null,
          order !== undefined ? `Media order: ${order}` : null,
        ]
          .filter(Boolean)
          .join(' • '),
        media: image || previewImage,
      }
    },
  },
})
