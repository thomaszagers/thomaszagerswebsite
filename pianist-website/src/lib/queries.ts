import groq from "groq";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    siteTitle,
    contactHeading,
    contactIntro,
    contactButtonLabel,
    contactEmail,
    contactBackgroundImage,
    socialLinks[]{
      platform,
      label,
      url
    },
    businessName,
    kvkNumber,
    vatNumber,
    copyrightText
  }
`;

export const homepageQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    heroTitle,
    heroTypedLine,
    heroDescription,
    heroImage,
    heroPrimaryCtaLabel,
    heroSecondaryCtaLabel,
    biographyTeaser
  }
`;

export const biographyQuery = groq`
  *[_type == "biography" && _id == "biography"][0]{
    shortBio,
    portrait,
    fullBio
  }
`;

export const agendaPageQuery = groq`
  *[_type == "agendaPage" && _id == "agendaPage"][0]{
    heroTitleUpcoming,
    heroDescriptionUpcoming,
    heroTitlePast,
    heroDescriptionPast,
    upcomingTabLabel,
    pastTabLabel,
    cancelledSectionTitle,
    heroImage,
    emptyUpcomingText,
    emptyPastText
  }
`;

export const mediaPageQuery = groq`
  *[_type == "mediaPage" && _id == "mediaPage"][0]{
    heroTitle,
    heroDescription,
    heroImage,
    emptyText
  }
`;

export const eventsQuery = groq`
  *[_type == "event"] | order(date asc, time asc){
    _id,
    title,
    program,
    date,
    time,
    venue,
    city,
    address,
    country,
    ticketUrl,
    detailsUrl,
    featured,
    status,
    notes
  }
`;

export const featuredEventsQuery = groq`
  *[_type == "event" && featured == true && status != "cancelled"] | order(date asc, time asc){
    _id,
    title,
    program,
    date,
    time,
    venue,
    city,
    address,
    country,
    ticketUrl,
    detailsUrl,
    featured,
    status,
    notes
  }
`;

export const projectsQuery = groq`
  *[_type == "project" && coalesce(isCurrent, true) == true]
  | order(featured desc, order asc, _createdAt asc){
    _id,
    name,
    category,
    role,
    logo,
    image,
    shortDescription,
    description,
    featured,
    isCurrent,
    projectUrl,
    order
  }
`;

export const mediaItemsQuery = groq`
  *[_type == "mediaItem"] | order(featured desc, order asc, _createdAt asc){
    _id,
    title,
    type,
    image,
    previewImage,
    embedUrl,
    caption,
    featured,
    order
  }
`;

export const repertoireItemsQuery = groq`
  *[_type == "repertoireItem"] | order(order asc, _createdAt asc){
    _id,
    composer,
    workTitle,
    category,
    duration,
    notes,
    order
  }
`;