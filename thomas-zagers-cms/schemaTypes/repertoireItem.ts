import {defineField, defineType} from 'sanity'

export const repertoireItemType = defineType({
  name: 'repertoireItem',
  title: 'Repertoire Item',
  type: 'document',
  fields: [
    defineField({
      name: 'composer',
      title: 'Composer',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'workTitle',
      title: 'Work title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Classical', value: 'classical'},
          {title: 'Jazz', value: 'jazz'},
          {title: 'Chamber Music', value: 'chamber-music'},
          {title: 'Collaboration', value: 'collaboration'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Example: 8 min',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower number appears first',
    }),
  ],
  preview: {
    select: {
      title: 'workTitle',
      subtitle: 'composer',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle,
      }
    },
  },
})