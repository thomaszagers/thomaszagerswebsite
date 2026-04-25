# Thomas Zagers Website

Professional portfolio website for Thomas Zagers Music.

## Project structure

- `pianist-website/` — public React website
- `thomas-zagers-cms/` — Sanity Studio CMS

## Website hosting

The frontend is intended to be hosted on Netlify.

Build settings:

- Base directory: `pianist-website`
- Build command: `npm run build`
- Publish directory: `dist`

## CMS

Content is managed in Sanity Studio.

Editable content includes:

- Homepage
- Biography
- Agenda / events
- Projects
- Media
- Contact and footer settings
- Repertoire, prepared for future updates

## Local development

Frontend:

```bash
cd pianist-website
npm install
npm run dev
