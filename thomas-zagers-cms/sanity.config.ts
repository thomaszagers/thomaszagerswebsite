import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { deskStructure } from './schemaTypes/deskStructure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'thomas-zagers-cms',

  projectId: 'du8uvp02',
  dataset: 'production',

  plugins: [structureTool({ structure: deskStructure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
